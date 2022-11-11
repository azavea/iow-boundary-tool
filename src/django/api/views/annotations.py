from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.views import APIView

from ..exceptions import BadRequestException
from ..models.boundary import BOUNDARY_STATUS
from ..models.submission import Annotation
from ..permissions import UserCanReviewBoundaries
from ..serializers.annotation import NewAnnotationSerializer, UpdateAnnotationSerializer
from .boundary import get_boundary_queryset_for_user


class AnnotationAPIView(APIView):
    permission_classes = [IsAuthenticated, UserCanReviewBoundaries]

    def get_boundary(self, request, boundary_id):
        return get_object_or_404(
            get_boundary_queryset_for_user(request.user), pk=boundary_id
        )

    def check_boundary_is_in_review(self, boundary):
        if boundary.status != BOUNDARY_STATUS.IN_REVIEW:
            raise BadRequestException(
                'A boundary must be in review to add annotations to it.'
            )

    def get_annotation(self, boundary, annotation_id):
        return get_object_or_404(
            Annotation.objects.filter(review=boundary.latest_submission.review),
            pk=annotation_id,
        )


class AnnotationCreateView(AnnotationAPIView):
    def post(self, request, boundary_id, format=None):
        boundary = self.get_boundary(request, boundary_id)
        self.check_boundary_is_in_review(boundary)

        serializer = NewAnnotationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        annotation = Annotation.objects.create(
            review=boundary.latest_submission.review,
            **serializer.validated_data,
        )

        return Response(annotation.id, status=HTTP_201_CREATED)


class AnnotationUpdateView(AnnotationAPIView):
    def put(self, request, boundary_id, annotation_id, format=None):
        boundary = self.get_boundary(request, boundary_id)
        self.check_boundary_is_in_review(boundary)

        serializer = UpdateAnnotationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        annotation = self.get_annotation(boundary, annotation_id)

        annotation.comment = serializer.validated_data['comment']
        if serializer.validated_data['resolved']:
            annotation.resolve()

        annotation.save()

        return Response(status=HTTP_204_NO_CONTENT)

    def delete(self, request, boundary_id, annotation_id, format=None):
        boundary = self.get_boundary(request, boundary_id)
        self.check_boundary_is_in_review(boundary)

        annotation = self.get_annotation(boundary, annotation_id)

        annotation.delete()

        return Response(status=HTTP_204_NO_CONTENT)
