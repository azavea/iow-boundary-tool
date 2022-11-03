from datetime import datetime, timezone

from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.gis.db import models as gis_models

from .boundary import Boundary
from .user import User, Roles

__all__ = ["Submission", "Approval", "Review", "Annotation"]


def limit_by_validator_or_admin():
    return models.Q(role__in=[Roles.VALIDATOR, Roles.ADMINISTRATOR])


def shape_upload_path(instance, filename):
    return (
        f"boundaries/{instance.boundary.id}/submissions/{instance.id}/shape/{filename}"
    )


class Submission(models.Model):
    boundary = models.ForeignKey(
        Boundary, on_delete=models.PROTECT, related_name='submissions'
    )
    shape = gis_models.PolygonField(geography=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="creator"
    )
    submitted_at = models.DateTimeField(null=True, blank=True)
    submitted_by = models.ForeignKey(
        User, on_delete=models.PROTECT, blank=True, null=True, related_name="submitter"
    )
    updated_at = models.DateTimeField(auto_now=True)
    upload_file = models.FileField(null=True, blank=True, upload_to=shape_upload_path)
    upload_filename = models.CharField(max_length=255, blank=True)
    upload_edited_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        get_latest_by = 'created_at'

    def clean(self):
        if self.submitted_at is not None and self.submitted_by is None:
            raise ValidationError("Must define User submitting.")
        super().clean()

    def __str__(self):
        return f"Submission {self.pk} for {self.boundary}"

    @property
    def primary_contact(self):
        return self.created_by


class Review(models.Model):
    submission = models.OneToOneField(
        Submission, on_delete=models.PROTECT, related_name='review'
    )
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        limit_choices_to=limit_by_validator_or_admin,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def clean(self):
        if self.reviewed_at is not None and self.reviewed_by is None:
            raise ValidationError("Must define User submitting review.")
        super().clean()


class Approval(models.Model):
    submission = models.OneToOneField(
        Submission, on_delete=models.PROTECT, related_name='approval'
    )
    approved_at = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to=limit_by_validator_or_admin,
        related_name='approver',
    )
    unapproved_at = models.DateTimeField(null=True, blank=True)
    unapproved_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        limit_choices_to=limit_by_validator_or_admin,
        related_name='unapprover',
    )

    def clean(self):
        if self.unapproved_at is not None and self.unapproved_by is None:
            raise ValidationError("Must define User unapproving.")
        super().clean()


class Annotation(models.Model):
    review = models.ForeignKey(
        Review, on_delete=models.PROTECT, related_name='annotations'
    )
    location = gis_models.PointField(geography=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.comment

    @property
    def resolved(self):
        return self.resolved_at is not None

    def resolve(self):
        self.resolved_at = datetime.now(tz=timezone.utc)
