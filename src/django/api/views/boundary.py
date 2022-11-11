import json

from django.db.models import Prefetch, functions
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import NotAuthenticated
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.views import APIView

from ..exceptions import BadRequestException
from ..mail import (
    send_boundary_approved_email,
    send_boundary_submitted_contributor_email,
    send_boundary_submitted_validator_email,
)
from ..models import ReferenceImage, Roles, Submission
from ..models.boundary import BOUNDARY_STATUS, Boundary
from ..models.submission import Approval
from ..parsers import NewBoundaryParser
from ..permissions import UserCanUnapproveBoundaries, UserCanWriteBoundaries
from ..serializers import (
    BoundaryDetailSerializer,
    BoundaryListSerializer,
    NewBoundarySerializer,
    ShapeUpdateSerializer,
)


def get_boundary_queryset_for_user(user):
    if user.role == Roles.CONTRIBUTOR:
        return Boundary.objects.filter(utility__in=user.utilities.all())

    if user.role == Roles.VALIDATOR:
        return Boundary.objects.filter(utility__state__in=user.states.all())

    if user.role == Roles.ADMINISTRATOR:
        return Boundary.objects.all()

    raise RuntimeError('Invalid role: {}'.format(user.role))


class BoundaryView(APIView):
    def get_boundary(self, request, boundary_id):
        return get_object_or_404(
            get_boundary_queryset_for_user(request.user), pk=boundary_id
        )

    def check_boundary_is_editable(self, boundary):
        if boundary.status != BOUNDARY_STATUS.DRAFT:
            raise BadRequestException(
                'Cannot update shape of boundary with status: {}'.format(
                    boundary.status
                ),
            )

    def check_boundary_needs_revisions(self, boundary):
        if boundary.status != BOUNDARY_STATUS.NEEDS_REVISIONS:
            raise BadRequestException(
                'Cannot create a new submission for boundary with status {}'.format(
                    boundary.status
                ),
            )


class BoundaryListView(APIView):
    permission_classes = [IsAuthenticated, UserCanWriteBoundaries]
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
        data = request.data

        # Associate reference images with metadata, if any
        if 'reference_images_meta' in data:
            if len(data['reference_images_meta']) != len(data['reference_images[]']):
                raise BadRequestException(
                    'Mismatch between reference image files and metadata'
                )

            for idx, meta in enumerate(data['reference_images_meta']):
                meta['file'] = data['reference_images[]'][idx]
                data['reference_images_meta'][idx] = meta

        # If shape specified as a file, ingest and also upload it
        if 'shape' in data:
            # If the shape is uploaded with reference images
            # it comes through as a singleton list, otherwise just a file.
            shape = data['shape']
            shape = shape[0] if isinstance(shape, list) else shape
            data['shape'] = shape
            data['upload_file'] = shape

        serializer = NewBoundarySerializer(data=data)
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
    permission_classes = [IsAuthenticated, UserCanWriteBoundaries]

    def patch(self, request, id, format=None):
        boundary_set = get_boundary_queryset_for_user(request.user)
        boundary_set = boundary_set.select_related('utility__state')
        boundary = get_object_or_404(boundary_set, pk=id)
        if boundary.status != BOUNDARY_STATUS.DRAFT:
            raise BadRequestException(
                "Cannot submit boundary with status: {}".format(boundary.status.value),
            )

        now = timezone.now()
        yyyy_mm_dd = now.isoformat()[:10]
        fp = f"{boundary.utility.pwsid}_{boundary.utility.address_city}_{yyyy_mm_dd}"

        if "notes" not in request.data:
            raise BadRequestException("Cannot submit boundary without notes")

        boundary.latest_submission.notes = request.data["notes"]
        boundary.latest_submission.upload_filename = fp
        boundary.latest_submission.submitted_by = request.user
        boundary.latest_submission.submitted_at = now
        boundary.latest_submission.save()

        send_boundary_submitted_validator_email(request, boundary)
        send_boundary_submitted_contributor_email(request, boundary)

        return Response(status=HTTP_204_NO_CONTENT)


class BoundaryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        boundary_set = get_boundary_queryset_for_user(request.user)
        boundary_set = boundary_set.select_related('utility')
        boundary_set = boundary_set.prefetch_related(
            Prefetch(
                'submissions',
                queryset=Submission.objects.select_related('review')
                .prefetch_related('review__annotations')
                .prefetch_related(
                    Prefetch(
                        'approvals',
                        queryset=Approval.objects.order_by('-approved_at'),
                    )
                )
                .order_by(
                    functions.Coalesce(
                        'review__reviewed_at',
                        'submitted_at',
                        'created_at',
                    ).desc()
                ),
            )
        )

        boundary = get_object_or_404(boundary_set, pk=id)

        return Response(BoundaryDetailSerializer(boundary).data)


class BoundaryShapeView(BoundaryView):
    permission_classes = [IsAuthenticated, UserCanWriteBoundaries]

    def put(self, request, id, format=None):
        boundary = self.get_boundary(request, id)
        self.check_boundary_is_editable(boundary)

        data = request.data
        if "file" in data:
            data["upload_file"] = data["file"]

        serializer = ShapeUpdateSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        if "shape" in serializer.validated_data:
            boundary.latest_submission.shape = serializer.validated_data["shape"]

        if "file" in serializer.validated_data:
            boundary.latest_submission.shape = serializer.validated_data["file"]
            boundary.latest_submission.upload_file = serializer.validated_data[
                "upload_file"
            ]
            boundary.latest_submission.upload_filename = serializer.validated_data[
                "upload_file"
            ].name

        boundary.latest_submission.save()

        if boundary.latest_submission.shape:
            return Response(json.loads(boundary.latest_submission.shape.geojson))
        else:
            return Response(status=HTTP_204_NO_CONTENT)

    def delete(self, request, id, format=None):
        boundary = self.get_boundary(request, id)
        self.check_boundary_is_editable(boundary)

        boundary.latest_submission.shape = None
        boundary.latest_submission.save()

        return Response(status=HTTP_204_NO_CONTENT)


class BoundaryDraftView(BoundaryView):
    permission_classes = [IsAuthenticated, UserCanWriteBoundaries]

    def post(self, request, boundary_id, format=None):
        boundary = self.get_boundary(request, boundary_id)
        self.check_boundary_needs_revisions(boundary)

        boundary.submissions.create(
            created_by=request.user,
            shape=boundary.latest_submission.shape,
        )

        return Response(status=HTTP_204_NO_CONTENT)


class BoundaryApproveView(BoundaryView):
    permission_classes = [IsAuthenticated]

    def post(self, request, boundary_id, format=None):
        boundary = self.get_boundary(request, boundary_id)
        self.check_boundary_is_approvable(boundary, request.user.role)

        boundary.latest_submission.approvals.create(approved_by=request.user)

        send_boundary_approved_email(request, boundary)

        return Response(status=HTTP_204_NO_CONTENT)

    def check_boundary_is_approvable(self, boundary, user_role):
        if user_role == Roles.ADMINISTRATOR:
            if boundary.status not in [
                BOUNDARY_STATUS.SUBMITTED,
                BOUNDARY_STATUS.IN_REVIEW,
                BOUNDARY_STATUS.NEEDS_REVISIONS,
            ]:
                raise BadRequestException(
                    'This boundary is not in an approvable state.',
                )

        elif user_role == Roles.VALIDATOR:
            if boundary.status not in [
                BOUNDARY_STATUS.SUBMITTED,
                BOUNDARY_STATUS.IN_REVIEW,
            ]:
                raise BadRequestException(
                    'This boundary must be submitted or in review to be approved.',
                )

        else:
            raise BadRequestException('You are not able to approve boundaries.')


class BoundaryUnapproveView(BoundaryView):
    permission_classes = [IsAuthenticated, UserCanUnapproveBoundaries]

    def post(self, request, boundary_id, format=None):
        boundary = self.get_boundary(request, boundary_id)
        self.check_boundary_is_unapprovable(boundary, request.user.role)

        approval = boundary.latest_submission.latest_approval
        approval.unapprove(request.user)
        approval.save()

        return Response(status=HTTP_204_NO_CONTENT)

    def check_boundary_is_unapprovable(self, boundary, user_role):
        if boundary.status != BOUNDARY_STATUS.APPROVED:
            raise BadRequestException(
                'Only approved boundaries can be unapproved',
            )
