from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    CharField,
    DateTimeField,
)

from ..models import Submission


class ActivityDraftedSerializer(ModelSerializer):
    user = CharField(source='created_by.full_name')
    action = SerializerMethodField()
    time = DateTimeField(source='created_at')
    notes = ''

    def get_action(self, value):
        return 'Drafted'

    class Meta:
        model = Submission
        fields = ['user', 'action', 'time']
        optional_fields = ['annotations_count', 'notes']


class ActivitySubmittedSerializer(ActivityDraftedSerializer):
    def to_representation(self, instance):
        obj = super().to_representation(instance)
        obj['action'] = 'Submitted'
        obj['time'] = instance.submitted_at
        obj['user'] = instance.submitted_by.full_name
        obj['notes'] = instance.notes
        return obj


class ActivityReviewStartedSerializer(ActivityDraftedSerializer):
    def to_representation(self, instance):
        obj = super().to_representation(instance)
        review = instance.review
        obj['action'] = 'Review Started'
        obj['time'] = review.created_at
        obj['user'] = review.reviewed_by.full_name
        # Don't show review notes in log until review is complete
        if hasattr(obj, 'notes'):
            obj.pop('notes')
        return obj


class ActivityReviewedSerializer(ActivityReviewStartedSerializer):
    def to_representation(self, instance):
        obj = super().to_representation(instance)
        review = instance.review
        obj['action'] = 'Reviewed'
        obj['time'] = review.reviewed_at
        obj['notes'] = review.notes
        obj['annotations_count'] = review.annotations.count()
        return obj


class ActivityApprovedSerializer(ActivityDraftedSerializer):
    def to_representation(self, instance):
        obj = super().to_representation(instance)
        approval = instance.approval
        if approval.approved_at:
            obj['action'] = 'Approved'
            obj['time'] = approval.approved_at
            obj['user'] = approval.approved_by.full_name
            if hasattr(obj, 'notes'):
                obj.pop('notes')
        return obj
