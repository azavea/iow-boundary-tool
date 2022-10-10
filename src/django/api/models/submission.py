from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.gis.db import models as gis_models

from .boundary import Boundary
from .user import User, Roles

__all__ = ["Submission", "Approval", "Review", "Annotation"]


def limit_by_validator_or_admin():
    return models.Q(role__in=[Roles.VALIDATOR, Roles.ADMINISTRATOR])


class Submission(models.Model):
    boundary = models.ForeignKey(Boundary, on_delete=models.PROTECT)
    shape = gis_models.PolygonField(geography=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="creator"
    )
    submitted_at = models.DateTimeField(null=True, blank=True)
    submitted_by = models.ForeignKey(
        User, on_delete=models.PROTECT, blank=True, null=True, related_name="submitter"
    )
    updated_at = models.DateTimeField(auto_now=True)
    upload_filename = models.CharField(max_length=255, blank=True)
    upload_edited_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def clean(self):
        if self.submitted_at is not None and self.submitted_by is None:
            raise ValidationError("Must define User submitting.")
        super().clean()

    def __str__(self):
        return f"Submission {self.pk} for {self.boundary}"


class Review(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.PROTECT)
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
    submission = models.ForeignKey(Submission, on_delete=models.PROTECT)
    approved_at = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey(
        User, on_delete=models.PROTECT, limit_choices_to=limit_by_validator_or_admin
    )


class Annotation(models.Model):
    review = models.ForeignKey(Review, on_delete=models.PROTECT)
    location = gis_models.PointField(geography=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.comment
