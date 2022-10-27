from datetime import datetime
from pytz import timezone

from django.conf import settings
from django.db.models import Prefetch, functions
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.exceptions import NotAuthenticated, PermissionDenied

from ..serializers import (
    BoundaryListSerializer,
    BoundaryDetailSerializer,
    ShapeSerializer,
    NewBoundarySerializer,
)
from ..parsers import NewBoundaryParser
from ..models import Roles, Submission, ReferenceImage
from ..models.boundary import BOUNDARY_STATUS, Boundary
from ..exceptions import BadRequestException


def get_boundary_queryset_for_user(user):
    if user.role == Roles.CONTRIBUTOR:
        return Boundary.objects.filter(utility__in=user.utilities.all())

    if user.role == Roles.VALIDATOR:
        return Boundary.objects.filter(utility__state__in=user.states.all())

    if user.role == Roles.ADMINISTRATOR:
        return Boundary.objects.all()

    raise RuntimeError('Invalid role: {}'.format(user.role))


class BoundaryListView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [NewBoundaryParser]

    def get(self, request, format=None):
        boundaries = get_boundary_queryset_for_user(request.user)
        boundaries = boundaries.select_related('utility')

        requested_utility_ids = BoundaryListView.get_requested_utility_ids(request)
        if requested_utility_ids is not None:
            boundaries = boundaries.filter(utility__in=requested_utility_ids)

        return Response(BoundaryListSerializer(boundaries, many=True).data)

    @staticmethod
    def get_requested_utility_ids(request):
        utilities_parameter = request.GET.get('utilities')
        if utilities_parameter:
            return utilities_parameter.split(',')

        return None

    def post(self, request, format=None):
        if (
            request.user.role != Roles.CONTRIBUTOR
            and request.user.role != Roles.ADMINISTRATOR
        ):
            raise PermissionDenied(
                'Only contributors and validators may create boundaries.'
            )

        serializer = NewBoundarySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        utility = validated_data['utility']

        if utility not in request.user.utilities.all():
            raise NotAuthenticated()

        existing_boundary = Boundary.objects.filter(utility=utility).first()
        if existing_boundary and existing_boundary.status == BOUNDARY_STATUS.DRAFT:
            for reference_image in validated_data.get('reference_images_meta', []):
                ReferenceImage.objects.create(
                    boundary=existing_boundary,
                    uploaded_by=request.user,
                    **reference_image,
                )

            return Response(existing_boundary.id)

        new_boundary = serializer.create(
            serializer.validated_data,
            created_by_user=request.user,
        )

        return Response(new_boundary.id)


class BoundarySubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id, format=None):
        if request.user.role not in [Roles.CONTRIBUTOR, Roles.ADMINISTRATOR]:
            raise PermissionDenied(
                "Only contributors and administrators can submit boundaries."
            )

        boundary_set = get_boundary_queryset_for_user(request.user)
        boundary_set = boundary_set.prefetch_related("submissions")
        boundary = get_object_or_404(boundary_set, pk=id)
        if boundary.status != BOUNDARY_STATUS.DRAFT:
            raise BadRequestException(
                "Cannot submit boundary with status: {}".format(boundary.status.value),
            )

        now = datetime.now(tz=timezone(settings.TIME_ZONE))
        yyyy_mm_dd = now.isoformat()[:10]
        fp = f"{boundary.utility.pwsid}_{boundary.utility.address_city}_{yyyy_mm_dd}"

        if "notes" not in request.data:
            raise BadRequestException("Cannot submit boundary without notes")

        boundary.latest_submission.notes = request.data["notes"]
        boundary.latest_submission.upload_filename = fp
        boundary.latest_submission.submitted_by = request.user
        boundary.latest_submission.submitted_at = now
        boundary.latest_submission.save()

        return Response(status=HTTP_204_NO_CONTENT)


class BoundaryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        boundary_set = get_boundary_queryset_for_user(request.user)
        boundary_set = boundary_set.select_related('utility')
        boundary_set = boundary_set.prefetch_related(
            Prefetch(
                'submissions',
                queryset=Submission.objects.select_related('review', 'approval')
                .prefetch_related('review__annotations')
                .order_by(
                    functions.Coalesce(
                        'approval__approved_at',
                        'review__reviewed_at',
                        'submitted_at',
                        'created_at',
                    ).desc()
                ),
            )
        )

        boundary = get_object_or_404(boundary_set, pk=id)

        return Response(BoundaryDetailSerializer(boundary).data)


class BoundaryShapeView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id, format=None):
        boundary_set = get_boundary_queryset_for_user(request.user)
        boundary_set = boundary_set.prefetch_related('submissions')
        boundary = get_object_or_404(boundary_set, pk=id)

        if request.user.role not in [Roles.CONTRIBUTOR, Roles.ADMINISTRATOR]:
            raise PermissionDenied(
                'Only contributors and administrators can edit boundaries.'
            )

        if boundary.status != BOUNDARY_STATUS.DRAFT:
            raise BadRequestException(
                'Cannot update shape of boundary with status: {}'.format(
                    boundary.status.value
                ),
            )

        serializer = ShapeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        boundary.latest_submission.shape = serializer.validated_data
        boundary.latest_submission.save()

        return Response(status=HTTP_204_NO_CONTENT)
