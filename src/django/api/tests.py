from datetime import datetime, timezone

from django.test import TestCase
from django.utils.log import request_logger
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from api.models import Utility, User
from api.models.boundary import Boundary
from api.models.user import Roles, State
from api.models.reference_image import ReferenceImage
from api.models.submission import Approval, Submission, Review, Annotation


from .management.test_shapes import (
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
            submitted_at=datetime.now(tz=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        Submission.objects.filter(pk=submission_3.pk).update(
            submitted_at=datetime.now(tz=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        Submission.objects.filter(pk=submission_4.pk).update(
            submitted_at=datetime.now(tz=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        Submission.objects.filter(pk=submission_5.pk).update(
            submitted_at=datetime.now(tz=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        Submission.objects.filter(pk=submission_6.pk).update(
            submitted_at=datetime.now(tz=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        # reviewing
        review_submission_3 = Review.objects.create(
            submission=submission_3,
            reviewed_by=cls.validator,
            notes="Notes for the review.",
            created_at=datetime.now(tz=timezone.utc),
        )

        review_submission_4 = Review.objects.create(
            submission=submission_4,
            reviewed_by=cls.validator,
            notes="Notes for the review.",
            created_at=datetime.now(tz=timezone.utc),
        )

        review_submission_6 = Review.objects.create(
            submission=submission_6,
            reviewed_by=cls.validator,
            notes="Notes for the review.",
            created_at=datetime.now(tz=timezone.utc),
        )

        Annotation.objects.create(
            review=review_submission_3,
            location=POINT_IN_RALEIGH_FAKE_TRIANGLE,
            comment="Comment on review",
            created_at=datetime.now(tz=timezone.utc),
        )

        Annotation.objects.create(
            review=review_submission_4,
            location=POINT_IN_RALEIGH_FAKE_TRIANGLE,
            comment="Comment on review",
            created_at=datetime.now(tz=timezone.utc),
        )

        Annotation.objects.create(
            review=review_submission_6,
            location=POINT_IN_RALEIGH_FAKE_TRIANGLE,
            comment="Comment on review",
            created_at=datetime.now(tz=timezone.utc),
        )

        # needs revision
        Review.objects.filter(pk=review_submission_4.pk).update(
            reviewed_at=datetime.now(tz=timezone.utc),
            reviewed_by=cls.validator,
            notes="Final notes for the review.",
        )

        Review.objects.filter(pk=review_submission_6.pk).update(
            reviewed_at=datetime.now(tz=timezone.utc),
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
            submitted_at=datetime.now(tz=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        # approved
        Approval.objects.create(
            submission=resubmission_6,
            approved_at=datetime.now(tz=timezone.utc),
            approved_by=cls.validator,
        )

        Approval.objects.create(
            submission=submission_5,
            approved_at=datetime.now(tz=timezone.utc),
            approved_by=cls.validator,
        )

        cls.reference_image = ReferenceImage.objects.create(
            filename="test_file.jpg",
            is_visible=True,
            boundary=cls.boundary_1,
            uploaded_by=cls.contributor,
        )

    def setUp(self):
        self.client = APIClient()
        self.client.force_login(self.contributor)


class ReferenceImageViewTests(BoundarySyncAPITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.new_image = {
            "filename": "test_file.jpg",
            "is_visible": True,
            "distortion": {},
            "opacity": 100,
            "uploaded_by": cls.contributor.pk,
        }
        cls.updated_image = {**cls.new_image, "is_visible": False}

    def test_no_image_list_endpoint(self):
        url = reverse("upload_image", args=[1])
        with self.assertLogs(request_logger, "WARNING"):
            response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # Contributor actions
    def test_contributor_upload_and_update_image(self):
        url = reverse("upload_image", args=[2])
        response = self.client.post(url, self.new_image, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReferenceImage.objects.filter(boundary__pk=2).count(), 1)

        update_url = reverse("update_image", args=[2, 1])
        # Attempt to alter the uploaded_by field, which is illegitimate.
        updated_image_illegitimate = {
            **self.updated_image,
            "uploaded_by": self.administrator.pk,
        }

        response = self.client.put(
            update_url, updated_image_illegitimate, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ri = ReferenceImage.objects.filter(boundary__pk=2).first()
        self.assertIs(ri.is_visible, False)
        self.assertEqual(ri.uploaded_by.pk, self.contributor.pk)

    def test_contributor_cannot_upload_for_invalid_boundary(self):
        url = reverse("upload_image", args=[2400])
        with self.assertLogs(request_logger, "WARNING"):
            response = self.client.post(url, self.new_image, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Validator actions
    def test_validator_cannot_upload_or_update_image(self):
        self.client.force_login(self.validator)
        url = reverse("upload_image", args=[1])
        with self.assertLogs(request_logger, "WARNING"):
            response = self.client.post(url, self.new_image, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        url = reverse("update_image", args=[1, 1])
        with self.assertLogs(request_logger, "WARNING"):
            response = self.client.put(url, self.updated_image, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
