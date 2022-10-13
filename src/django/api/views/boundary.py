from django.db.models import Prefetch
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from ..models.user import Roles
from ..models.boundary import Boundary
from ..models.submission import Submission

from ..serializers.boundary import BoundaryListSerializer, BoundaryDetailSerializer


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
                queryset=Submission.objects.select_related('review').prefetch_related(
                    'review__annotations'
                ),
            )
        )

        boundary = get_object_or_404(boundary_set, pk=id)

        return Response(BoundaryDetailSerializer(boundary).data)
