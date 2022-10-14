from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    ChoiceField,
    DateTimeField,
    SerializerMethodField,
)

from ..models.boundary import Boundary, BOUNDARY_STATUS
from ..models.utility import Utility
from ..models.submission import Submission, Review, Annotation

from .reference_image import ReferenceImageSerializer
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
        fields = ['utility', 'status', 'submission', 'reference_images', 'activity_log']
