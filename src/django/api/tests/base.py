from django.test import TestCase
from django.utils import timezone

from rest_framework.test import APIClient

from api.models import (
    Annotation,
    Approval,
    Boundary,
    Review,
    Roles,
    State,
    Submission,
    Utility,
    User,
)

from .data.shapes import (
    RALEIGH_FAKE_RECTANGLE,
    RALEIGH_FAKE_TRIANGLE,
    RALEIGH_FAKE_ZIGZAG,
    POINT_IN_RALEIGH_FAKE_TRIANGLE,
)


class BoundarySyncAPITestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        """Called also by resetdb command."""
        # Create test utility located in Raleigh.
        test_utility = Utility(
            pwsid="123456789",
            name="Azavea Test Utility",
            address_line_1="1 E Edenton St",
            address_city="Raleigh",
            address_zip_code="27601",
        )
        test_utility.save()

        # Create another test utility.
        other_utility = Utility(pwsid="OTHERUTIL", name="Other Utility")
        other_utility.save()

        # Create test users.
        cls.administrator = User.objects.create_superuser(
            email="a1@azavea.com",
            password="password",
            full_name="Test Administrator",
            job_title="Administrator",
            phone_number="(123) 456-7890",
            has_admin_generated_password=False,
        )

        cls.validator = User.objects.create_user(
            email="v1@azavea.com",
            password="password",
            full_name="Test Validator",
            job_title="Validator",
            phone_number="(123) 456-7890",
            has_admin_generated_password=False,
            role=Roles.VALIDATOR,
        )
        cls.validator.states.add(State.objects.get(pk="NC"))

        cls.contributor = User.objects.create_user(
            email="c1@azavea.com",
            password="password",
            full_name="Test Contributor",
            job_title="Contributor",
            phone_number="(123) 456-7890",
            has_admin_generated_password=False,
            role=Roles.CONTRIBUTOR,
        )
        cls.contributor.utilities.add(test_utility)
        cls.contributor.utilities.add(other_utility)

        # Create test boundaries and submissions.
        # Use tz-aware datetimes to avoid warnings.
        cls.boundary_1 = Boundary.objects.create(
            utility=test_utility,
            name="Boundary 1",
        )
        cls.boundary_2 = Boundary.objects.create(
            utility=test_utility,
            name="Boundary 2",
        )
        cls.boundary_3 = Boundary.objects.create(
            utility=test_utility,
            name="Boundary 3",
        )
        cls.boundary_4 = Boundary.objects.create(
            utility=test_utility,
            name="Boundary 4",
        )
        cls.boundary_5 = Boundary.objects.create(
            utility=test_utility,
            name="Boundary 5",
        )
        cls.boundary_6 = Boundary.objects.create(
            utility=test_utility,
            name="Boundary 6",
        )

        # Submissions activities should follow
        # Draft-->Submission-->Approved/Revisions flow
        # Order of test data activities dependent on order of below methods executing,
        # So there is potential for order variation if unexpected execution sequence.
        # If variation, explicitly override the created_at value on Submission creation

        # draft
        Submission.objects.create(
            boundary=cls.boundary_1,
            shape=RALEIGH_FAKE_ZIGZAG,
            created_by=cls.contributor,
        )

        submission_2 = Submission.objects.create(
            boundary=cls.boundary_2,
            shape=RALEIGH_FAKE_TRIANGLE,
            created_by=cls.contributor,
        )

        submission_3 = Submission.objects.create(
            boundary=cls.boundary_3,
            shape=RALEIGH_FAKE_TRIANGLE,
            created_by=cls.contributor,
        )

        submission_4 = Submission.objects.create(
            boundary=cls.boundary_4,
            shape=RALEIGH_FAKE_TRIANGLE,
            created_by=cls.contributor,
        )

        submission_5 = Submission.objects.create(
            boundary=cls.boundary_5,
            shape=RALEIGH_FAKE_RECTANGLE,
            created_by=cls.contributor,
        )

        submission_6 = Submission.objects.create(
            boundary=cls.boundary_6,
            shape=RALEIGH_FAKE_ZIGZAG,
            created_by=cls.contributor,
        )

        # submitted
        Submission.objects.filter(pk=submission_2.pk).update(
            submitted_at=timezone.now(),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        Submission.objects.filter(pk=submission_3.pk).update(
            submitted_at=timezone.now(),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        Submission.objects.filter(pk=submission_4.pk).update(
            submitted_at=timezone.now(),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        Submission.objects.filter(pk=submission_5.pk).update(
            submitted_at=timezone.now(),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        Submission.objects.filter(pk=submission_6.pk).update(
            submitted_at=timezone.now(),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        # reviewing
        review_submission_3 = Review.objects.create(
            submission=submission_3,
            reviewed_by=cls.validator,
            notes="Notes for the review.",
            created_at=timezone.now(),
        )

        review_submission_4 = Review.objects.create(
            submission=submission_4,
            reviewed_by=cls.validator,
            notes="Notes for the review.",
            created_at=timezone.now(),
        )

        review_submission_6 = Review.objects.create(
            submission=submission_6,
            reviewed_by=cls.validator,
            notes="Notes for the review.",
            created_at=timezone.now(),
        )

        Annotation.objects.create(
            review=review_submission_3,
            location=POINT_IN_RALEIGH_FAKE_TRIANGLE,
            comment="Comment on review",
            created_at=timezone.now(),
        )

        Annotation.objects.create(
            review=review_submission_4,
            location=POINT_IN_RALEIGH_FAKE_TRIANGLE,
            comment="Comment on review",
            created_at=timezone.now(),
        )

        Annotation.objects.create(
            review=review_submission_6,
            location=POINT_IN_RALEIGH_FAKE_TRIANGLE,
            comment="Comment on review",
            created_at=timezone.now(),
        )

        # needs revision
        Review.objects.filter(pk=review_submission_4.pk).update(
            reviewed_at=timezone.now(),
            reviewed_by=cls.validator,
            notes="Final notes for the review.",
        )

        Review.objects.filter(pk=review_submission_6.pk).update(
            reviewed_at=timezone.now(),
            reviewed_by=cls.validator,
            notes="Final notes for the review.",
        )

        # new submission draft

        resubmission_6 = Submission.objects.create(
            boundary=cls.boundary_6,
            shape=RALEIGH_FAKE_TRIANGLE,
            created_by=cls.contributor,
        )

        # re-submit for review

        Submission.objects.filter(pk=resubmission_6.pk).update(
            submitted_at=timezone.now(),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        # approved
        approval_6 = Approval.objects.create(
            submission=resubmission_6,
            approved_at=timezone.now(),
            approved_by=cls.validator,
        )

        approval_6.unapproved_by = cls.validator
        approval_6.unapproved_at = timezone.now()
        approval_6.save()

        Approval.objects.create(
            submission=submission_5,
            approved_at=timezone.now(),
            approved_by=cls.validator,
        )

    def setUp(self):
        self.client = APIClient()
        self.client.force_login(self.contributor)
