from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    ChoiceField,
    DateTimeField,
)

from ..models.boundary import Boundary, BOUNDARY_STATUS
from ..models.utility import Utility
from ..models.submission import Submission, Review, Annotation

from .reference_image import ReferenceImageSerializer


class StatusField(ChoiceField):
    def __init__(self):
        super().__init__(choices=[status for status in BOUNDARY_STATUS])

    def to_representation(self, status):
        return status.value


class BoundaryListSerializer(ModelSerializer):
    location = CharField(source='utility.name')
    pwsid = CharField(source='utility.pwsid')
    last_modified = DateTimeField()
    status = StatusField()

    class Meta:
        model = Boundary
        fields = ['id', 'location', 'pwsid', 'last_modified', 'status']


class BoundaryDetailSerializer(ModelSerializer):
    class UtilitySerializer(ModelSerializer):
        class Meta:
            model = Utility
            fields = ['name', 'pwsid']

    class SubmissionSerializer(ModelSerializer):
        class ReviewSerializer(ModelSerializer):
            class AnnotationSerializer(ModelSerializer):
                class Meta:
                    model = Annotation
                    fields = ['location', 'comment', 'resolved']

            annotations = AnnotationSerializer(many=True)

            class Meta:
                model = Review
                fields = ['annotations', 'notes']

        review = ReviewSerializer(required=False)

        class Meta:
            model = Submission
            fields = ['shape', 'notes', 'review']

    utility = UtilitySerializer()
    status = StatusField()
    submission = SubmissionSerializer(source='latest_submission')
    reference_images = ReferenceImageSerializer(many=True)

    class Meta:
        model = Boundary
        fields = ['utility', 'status', 'submission', 'reference_images']
