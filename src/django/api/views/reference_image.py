from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from ..models import Boundary, ReferenceImage
from ..models.user import Roles
from ..serializers.reference_image import ReferenceImageSerializer
from ..views.boundary import get_boundary_queryset_for_user


class ReferenceImageList(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReferenceImageSerializer

    def get_queryset(self):
        return get_boundary_queryset_for_user(self.request.user)

    def create(self, request, *args, **kwargs):
        boundary = get_object_or_404(Boundary, pk=self.kwargs["boundary"])

        if (
            request.user.role == Roles.CONTRIBUTOR
            and boundary.utility not in request.user.utilities.all()
        ):
            raise PermissionDenied("Cannot post data for that utility.")
        if request.user.role == Roles.VALIDATOR:
            raise PermissionDenied("Validators cannot upload images.")

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(
            boundary_id=self.kwargs["boundary"], uploaded_by=self.request.user
        )


class ReferenceImageDetail(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReferenceImageSerializer

    def get_queryset(self):
        if self.request.user.role == Roles.VALIDATOR:
            raise PermissionDenied("Validators cannot edit image details.")
        return ReferenceImage.objects.all()

    def perform_update(self, serializer):
        serializer.save(boundary_id=self.kwargs["boundary"])
