from django.db.models import Prefetch, functions
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_204_NO_CONTENT


from ..models.boundary import BOUNDARY_STATUS
from ..serializers import (
    BoundaryListSerializer,
    BoundaryDetailSerializer,
    ShapeSerializer,
)
from ..models import Boundary, Roles, Submission
from ..exceptions import ForbiddenException, BadRequestException


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
            raise ForbiddenException(
                'Only contributors and administrators can edit boundaries.'
            )

        if boundary.status != BOUNDARY_STATUS.DRAFT:
            raise BadRequestException(
                'Cannot update shape of boundary with status: {}'.format(
                    boundary.status
                ),
            )

        serializer = ShapeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        boundary.latest_submission.shape = serializer.validated_data
        boundary.latest_submission.save()

        return Response(status=HTTP_204_NO_CONTENT)
