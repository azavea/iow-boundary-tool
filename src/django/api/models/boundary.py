from enum import Enum
from django.utils.functional import cached_property
from django.db import models

from .utility import Utility

__all__ = ["Boundary"]


# In sync with app.src.constants.BOUNDARY_STATUS
class BOUNDARY_STATUS(Enum):
    DRAFT = "Draft"
    SUBMITTED = "Submitted"
    IN_REVIEW = "In Review"
    NEEDS_REVISIONS = "Needs Revisions"
    APPROVED = "Approved"


class Boundary(models.Model):
    utility = models.ForeignKey(Utility, on_delete=models.PROTECT)
    archived_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=127)

    class Meta:
        verbose_name_plural = "boundaries"

    def __str__(self):
        return f"{self.utility} Boundary"

    @cached_property
    def last_modified(self):
        if self.status == BOUNDARY_STATUS.DRAFT:
            return self.latest_submission.updated_at

        if self.status == BOUNDARY_STATUS.SUBMITTED:
            return self.latest_submission.submitted_at

        if self.status == BOUNDARY_STATUS.IN_REVIEW:
            return self.latest_submission.review.created_at

        if self.status == BOUNDARY_STATUS.NEEDS_REVISIONS:
            return self.latest_submission.review.reviewed_at

        if self.status == BOUNDARY_STATUS.APPROVED:
            return self.latest_submission.approval.approved_at

    @cached_property
    def status(self):
        if self.latest_submission.submitted_at is None:
            return BOUNDARY_STATUS.DRAFT

        if hasattr(self.latest_submission, 'approval'):
            return BOUNDARY_STATUS.APPROVED

        if hasattr(self.latest_submission, 'review'):
            review = self.latest_submission.review

            if review.reviewed_at is None:
                return BOUNDARY_STATUS.IN_REVIEW

            return BOUNDARY_STATUS.NEEDS_REVISIONS

        return BOUNDARY_STATUS.SUBMITTED

    @cached_property
    def latest_submission(self):
        return self.submissions.latest()
