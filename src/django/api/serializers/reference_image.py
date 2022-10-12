from rest_framework.serializers import ModelSerializer

from ..models.reference_image import ReferenceImage
from .boundary import BoundaryListSerializer


class ReferenceImageSerializer(ModelSerializer):
    boundary = BoundaryListSerializer

    class Meta:
        model = ReferenceImage
        fields = "__all__"
        read_only_fields = [
            "uploaded_at",
            "uploaded_by",
        ]
