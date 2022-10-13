from rest_framework.serializers import ModelSerializer

from ..models.reference_image import ReferenceImage


class ReferenceImageSerializer(ModelSerializer):
    class Meta:
        model = ReferenceImage
        exclude = ("boundary",)
        read_only_fields = [
            "uploaded_at",
            "uploaded_by",
        ]
