from rest_framework.serializers import CharField, DateTimeField, ModelSerializer

from ..models import Submission
from ..models.boundary import BOUNDARY_STATUS
from ..models.submission import Approval, Review


class EventSerializer(ModelSerializer):
    user = CharField()
    action = CharField()
    time = DateTimeField()
    notes = CharField(required=False)


class SubmissionEventSerializer(EventSerializer):
    class Meta:
        model = Submission
        fields = ['user', 'action', 'time']
        optional_fields = ['notes']


class ReviewEventSerializer(EventSerializer):
    class Meta:
        model = Review
        fields = ['user', 'action', 'time']
        optional_fields = ['annotation_count', 'notes']


class ApprovalEventSerializer(EventSerializer):
    class Meta:
        model = Approval
        fields = ['user', 'action', 'time']


class ActivityDraftedSerializer(SubmissionEventSerializer):
    def to_representation(self, submission):
        return {
            'user': submission.created_by.full_name,
            'action': BOUNDARY_STATUS.DRAFT.value,
            'time': submission.created_at,
        }


class ActivitySubmittedSerializer(SubmissionEventSerializer):
    def to_representation(self, submission):
        return {
            'user': submission.submitted_by.full_name,
            'action': BOUNDARY_STATUS.SUBMITTED.value,
            'time': submission.submitted_at,
            'notes': submission.notes,
        }


class ActivityReviewStartedSerializer(ReviewEventSerializer):
    def to_representation(self, review):
        return {
            'user': review.reviewed_by.full_name,
            'action': BOUNDARY_STATUS.IN_REVIEW.value,
            'time': review.created_at,
        }


class ActivityReviewedSerializer(ReviewEventSerializer):
    def to_representation(self, review):
        return {
            'user': review.reviewed_by.full_name,
            'action': BOUNDARY_STATUS.NEEDS_REVISIONS.value,
            'time': review.reviewed_at,
            'notes': review.notes,
            'annotations_count': review.annotations.count(),
        }


class ActivityApprovedSerializer(ApprovalEventSerializer):
    def to_representation(self, approval):
        return {
            'user': approval.approved_by.full_name,
            'action': BOUNDARY_STATUS.APPROVED.value,
            'time': approval.approved_at,
        }


class ActivityUnapprovedSerializer(ApprovalEventSerializer):
    def to_representation(self, approval):
        return {
            'user': approval.unapproved_by.full_name,
            'action': 'Unapproved',
            'time': approval.unapproved_at,
        }
