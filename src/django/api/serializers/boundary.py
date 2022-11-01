from django.db import transaction

from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    ChoiceField,
    DateTimeField,
    SerializerMethodField,
    PrimaryKeyRelatedField,
)

from ..models.boundary import Boundary, BOUNDARY_STATUS
from ..models.utility import Utility
from ..models.submission import Submission, Review, Annotation
from ..models.user import User
from ..models.reference_image import ReferenceImage

from .reference_image import ReferenceImageSerializer
from ..fields import ShapefileField
from .activity_log import (
    ActivityDraftedSerializer,
    ActivitySubmittedSerializer,
    ActivityReviewStartedSerializer,
    ActivityReviewedSerializer,
    ActivityApprovedSerializer,
)


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
        state = CharField(source='state.id')

        class Meta:
            model = Utility
            fields = [
                'name',
                'pwsid',
                'address_line_1',
                'address_line_2',
                'address_city',
                'address_zip_code',
                'state',
            ]

    class SubmissionSerializer(ModelSerializer):
        class PrimaryContactSerializer(ModelSerializer):
            class Meta:
                model = User
                fields = ['full_name', 'job_title', 'phone_number', 'email']

        class ReviewSerializer(ModelSerializer):
            class AnnotationSerializer(ModelSerializer):
                class Meta:
                    model = Annotation
                    fields = ['id', 'location', 'comment', 'resolved']

            annotations = AnnotationSerializer(many=True)

            class Meta:
                model = Review
                fields = ['annotations', 'notes']

        primary_contact = PrimaryContactSerializer()
        review = ReviewSerializer(required=False)

        class Meta:
            model = Submission
            fields = ['shape', 'notes', 'primary_contact', 'review']

    utility = UtilitySerializer()
    status = StatusField()
    submission = SubmissionSerializer(source='latest_submission')
    reference_images = ReferenceImageSerializer(many=True)
    activity_log = SerializerMethodField()

    def get_activity_log(self, value):
        log = []
        # Submissions already in desc order through pre-fetch
        for submission in value.submissions.all():
            if hasattr(submission, 'approval'):
                log.append(ActivityApprovedSerializer(submission).data)
            if hasattr(submission, 'review'):
                # Log when a review starts as well as when a review is complete
                # Complete review will log notes as well as if annotations
                if submission.review.reviewed_at:
                    log.append(ActivityReviewedSerializer(submission).data)
                log.append(ActivityReviewStartedSerializer(submission).data)
            if submission.submitted_at is not None:
                log.append(ActivitySubmittedSerializer(submission).data)
            log.append(ActivityDraftedSerializer(submission).data)
        return log

    class Meta:
        model = Boundary
        fields = [
            'name',
            'utility',
            'status',
            'submission',
            'reference_images',
            'activity_log',
        ]


class NewBoundarySerializer(ModelSerializer):
    utility_id = PrimaryKeyRelatedField(
        source='utility', queryset=Utility.objects.all()
    )
    reference_images_meta = ReferenceImageSerializer(many=True, required=False)
    shape = ShapefileField(required=False)

    class Meta:
        model = Boundary
        fields = ['utility_id', 'reference_images_meta', 'shape']

    @transaction.atomic
    def create(self, validated_data, created_by_user):
        boundary = Boundary.objects.create(
            utility=validated_data['utility'],
        )

        if 'reference_images_meta' in validated_data:
            for reference_image in validated_data['reference_images_meta']:
                ReferenceImage.objects.create(
                    boundary=boundary,
                    uploaded_by=created_by_user,
                    **reference_image,
                )

        draft = Submission(
            boundary=boundary,
            created_by=created_by_user,
        )

        if 'shape' in validated_data:
            draft.shape = validated_data['shape']

        draft.save()

        return boundary
