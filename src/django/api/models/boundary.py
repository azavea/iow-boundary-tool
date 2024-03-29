from enum import Enum

from django.db import models
from django.utils.functional import cached_property

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
            if (
                self.latest_submission.latest_approval is not None
                and self.latest_submission.latest_approval.revoked
            ):
                return self.latest_submission.latest_approval.unapproved_at

            return self.latest_submission.submitted_at

        if self.status == BOUNDARY_STATUS.IN_REVIEW:
            return self.latest_submission.review.created_at

        if self.status == BOUNDARY_STATUS.NEEDS_REVISIONS:
            return self.latest_submission.review.reviewed_at

        if self.status == BOUNDARY_STATUS.APPROVED:
            return self.latest_submission.latest_approval.approved_at

    @cached_property
    def status(self):
        if self.latest_submission.submitted_at is None:
            return BOUNDARY_STATUS.DRAFT

        if (
            self.latest_submission.latest_approval is not None
            and not self.latest_submission.latest_approval.revoked
        ):
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

    @cached_property
    def previous_submission(self):
        recent_submissions = self.submissions.order_by('-created_at')[:2]
        if recent_submissions.count() == 2:
            return recent_submissions[1]

        return None

    @cached_property
    def official_name(self):
        prefix = f"{self.utility.pwsid}_{self.utility.compact_name}"

        if self.status == BOUNDARY_STATUS.DRAFT:
            suffix = "UNSUBMITTED"
        else:
            suffix = self.latest_submission.submitted_at.strftime('%Y%m%d')

        return f"{prefix}_{suffix}"
