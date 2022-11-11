from operator import itemgetter

from django.db import transaction
from rest_framework.serializers import (
    CharField,
    ChoiceField,
    DateTimeField,
    FileField,
    ModelSerializer,
    PrimaryKeyRelatedField,
    SerializerMethodField,
)

from ..fields import ShapefileField
from ..models.boundary import BOUNDARY_STATUS, Boundary
from ..models.reference_image import ReferenceImage
from ..models.submission import Annotation, Review, Submission
from ..models.user import User
from ..models.utility import Utility
from .activity_log import (
    ActivityApprovedSerializer,
    ActivityDraftedSerializer,
    ActivityReviewedSerializer,
    ActivityReviewStartedSerializer,
    ActivitySubmittedSerializer,
    ActivityUnapprovedSerializer,
)
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
    previous_submission = SubmissionSerializer()
    reference_images = ReferenceImageSerializer(many=True)
    activity_log = SerializerMethodField()

    def get_activity_log(self, value):
        log = []

        for submission in value.submissions.all():
            log.append(ActivityDraftedSerializer(submission).data)

            if submission.submitted_at is not None:
                log.append(ActivitySubmittedSerializer(submission).data)

            if hasattr(submission, 'review'):
                log.append(ActivityReviewStartedSerializer(submission.review).data)

                # Log when a review starts as well as when a review is complete
                # Complete review will log notes as well as if annotations
                if submission.review.reviewed_at:
                    log.append(ActivityReviewedSerializer(submission.review).data)

            for approval in submission.approvals.all():
                log.append(ActivityApprovedSerializer(approval).data)

                if approval.revoked:
                    log.append(ActivityUnapprovedSerializer(approval).data)

        log.sort(key=itemgetter('time'), reverse=True)

        return log

    class Meta:
        model = Boundary
        fields = [
            'name',
            'utility',
            'status',
            'submission',
            'previous_submission',
            'reference_images',
            'activity_log',
        ]


class NewBoundarySerializer(ModelSerializer):
    utility_id = PrimaryKeyRelatedField(
        source='utility', queryset=Utility.objects.all()
    )
    reference_images_meta = ReferenceImageSerializer(many=True, required=False)
    shape = ShapefileField(required=False)
    upload_file = FileField(required=False)

    class Meta:
        model = Boundary
        fields = ['utility_id', 'reference_images_meta', 'shape', "upload_file"]

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

        if "upload_file" in validated_data:
            draft.upload_file = validated_data["upload_file"]
            draft.upload_filename = validated_data["upload_file"].name

        draft.save()

        return boundary
