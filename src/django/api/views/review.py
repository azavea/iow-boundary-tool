from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.response import Response

from .boundary import get_boundary_queryset_for_user
from ..exceptions import BadRequestException
from ..models.submission import Review
from ..models.boundary import BOUNDARY_STATUS
from ..permissions import UserCanReviewBoundaries


class ReviewView(APIView):
    def get_boundary(self, request, boundary_id):
        return get_object_or_404(
            get_boundary_queryset_for_user(request.user), pk=boundary_id
        )


class ReviewCreateView(ReviewView):
    permission_classes = [IsAuthenticated, UserCanReviewBoundaries]

    def post(self, request, boundary_id, format=None):
        boundary = self.get_boundary(request, boundary_id)
        if boundary.status != BOUNDARY_STATUS.SUBMITTED:
            raise BadRequestException('A boundary must be submitted to be reviewed.')

        Review.objects.create(
            submission=boundary.latest_submission,
            reviewed_by=request.user,
        )

        return Response(status=HTTP_204_NO_CONTENT)


class ReviewFinishView(ReviewView):
    permission_classes = [IsAuthenticated, UserCanReviewBoundaries]

    def post(self, request, boundary_id, format=None):
        boundary = self.get_boundary(request, boundary_id)

        if boundary.status != BOUNDARY_STATUS.IN_REVIEW:
            return BadRequestException('A boundary must be in review to be finished.')

        # TODO use a serializer
        review = boundary.latest_submission.review
        review.notes = request.data.get('notes', '')
        review.finish(request.user)
        review.save()

        return Response(status=HTTP_204_NO_CONTENT)
