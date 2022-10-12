from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from ..models import Boundary, ReferenceImage
from ..models.user import Roles
from ..serializers.reference_image import ReferenceImageSerializer


class ReferenceImageList(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReferenceImageSerializer

    def get_queryset(self):
        if self.request.user.role == Roles.VALIDATOR:
            raise PermissionDenied("Validators cannot view image details.")

        boundary = get_object_or_404(Boundary, pk=self.kwargs["boundary"])
        if boundary.utility not in self.request.user.utilities.all():
            raise PermissionDenied("Cannot view images for that utility.")

        return ReferenceImage.objects.filter(boundary=boundary)

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
        serializer.save(uploaded_by=self.request.user)


class ReferenceImageDetail(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReferenceImageSerializer
    queryset = ReferenceImage.objects.all()
