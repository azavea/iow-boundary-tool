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


class ReviewCreateView(APIView):
    permission_classes = [IsAuthenticated, UserCanReviewBoundaries]

    def get_queryset(self):
        return get_boundary_queryset_for_user(self.request.user)

    def post(self, request, boundary_id, format=None):
        boundary = get_object_or_404(
            get_boundary_queryset_for_user(request.user), pk=boundary_id
        )

        if boundary.status != BOUNDARY_STATUS.SUBMITTED:
            raise BadRequestException('A boundary must be submitted to be reviewed.')

        Review.objects.create(
            submission=boundary.latest_submission,
            reviewed_by=request.user,
        )

        return Response(status=HTTP_204_NO_CONTENT)
