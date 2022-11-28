from rest_framework.serializers import ModelSerializer, ValidationError

from ..models.reference_image import ReferenceImage


class ReferenceImageSerializer(ModelSerializer):
    class Meta:
        model = ReferenceImage
        exclude = ("boundary",)
        read_only_fields = [
            "uploaded_at",
            "uploaded_by",
        ]

    def validate_opacity(self, value):
        if value > 100:
            # DRF already validates negative values for PositiveIntegerField
            raise ValidationError("Opacity takes values from 0-100.")
        return value


class ReferenceImageUpdateSerializer(ReferenceImageSerializer):
    class Meta:
        model = ReferenceImage
        exclude = ("boundary",)
        read_only_fields = [
            "uploaded_at",
            "uploaded_by",
            "file",
            "filename",
        ]
