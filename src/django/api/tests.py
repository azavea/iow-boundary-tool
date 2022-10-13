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
        test_utility = Utility(pwsid="123456789", name="Azavea Test Utility")
        test_utility.save()

        # Create test users.
        cls.administrator = User.objects.create_superuser(
            email="a1@azavea.com",
            password="password",
            has_admin_generated_password=False,
        )

        cls.validator = User.objects.create_user(
            email="v1@azavea.com",
            password="password",
            has_admin_generated_password=False,
            role=Roles.VALIDATOR,
        )
        cls.validator.states.add(State.objects.get(pk="NC"))

        cls.contributor = User.objects.create_user(
            email="c1@azavea.com",
            password="password",
            has_admin_generated_password=False,
            role=Roles.CONTRIBUTOR,
        )
        cls.contributor.utilities.add(test_utility)

        # Create test boundaries and submissions.
        # Use tz-aware datetimes to avoid warnings.
        cls.boundary_1 = Boundary.objects.create(utility=test_utility)
        cls.boundary_2 = Boundary.objects.create(utility=test_utility)
        cls.boundary_3 = Boundary.objects.create(utility=test_utility)
        cls.boundary_4 = Boundary.objects.create(utility=test_utility)
        cls.boundary_5 = Boundary.objects.create(utility=test_utility)

        # draft
        Submission.objects.create(
            boundary=cls.boundary_1,
            shape=RALEIGH_FAKE_ZIGZAG,
            created_at=datetime(2022, 10, 3, hour=15, tzinfo=timezone.utc),
            created_by=cls.contributor,
        )

        # submitted
        Submission.objects.create(
            boundary=cls.boundary_2,
            shape=RALEIGH_FAKE_TRIANGLE,
            created_at=datetime(2022, 10, 2, hour=11, tzinfo=timezone.utc),
            created_by=cls.contributor,
            submitted_at=datetime(2022, 10, 2, hour=12, tzinfo=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        # reviewing
        submitted = Submission.objects.create(
            boundary=cls.boundary_3,
            shape=RALEIGH_FAKE_TRIANGLE,
            created_at=datetime(2022, 10, 2, hour=4, tzinfo=timezone.utc),
            created_by=cls.contributor,
            submitted_at=datetime(2022, 10, 2, hour=6, tzinfo=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        review = Review.objects.create(
            submission=submitted,
            reviewed_by=cls.validator,
            notes="Notes for the review.",
            created_at=datetime(2022, 10, 2, hour=10, tzinfo=timezone.utc),
        )

        Annotation.objects.create(
            review=review,
            location=POINT_IN_RALEIGH_FAKE_TRIANGLE,
            comment="Comment on review",
            created_at=datetime(2022, 10, 2, hour=10, minute=5, tzinfo=timezone.utc),
        )

        # needs revision
        submitted = Submission.objects.create(
            boundary=cls.boundary_4,
            shape=RALEIGH_FAKE_TRIANGLE,
            created_at=datetime(2022, 10, 2, hour=4, tzinfo=timezone.utc),
            created_by=cls.contributor,
            submitted_at=datetime(2022, 10, 2, hour=6, tzinfo=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test submission.",
        )

        review = Review.objects.create(
            submission=submitted,
            reviewed_by=cls.validator,
            reviewed_at=datetime(2022, 10, 2, hour=11, tzinfo=timezone.utc),
            notes="Notes for the review.",
            created_at=datetime(2022, 10, 2, hour=10, tzinfo=timezone.utc),
        )

        Annotation.objects.create(
            review=review,
            location=POINT_IN_RALEIGH_FAKE_TRIANGLE,
            comment="Comment on review",
            created_at=datetime(2022, 10, 2, hour=10, minute=5, tzinfo=timezone.utc),
        )

        # approved
        approved = Submission.objects.create(
            boundary=cls.boundary_5,
            shape=RALEIGH_FAKE_RECTANGLE,
            created_at=datetime(2022, 10, 1, hour=8, tzinfo=timezone.utc),
            created_by=cls.contributor,
            submitted_at=datetime(2022, 10, 1, hour=9, tzinfo=timezone.utc),
            submitted_by=cls.contributor,
            notes="Notes for the test approved boundary.",
        )

        Approval.objects.create(
            submission=approved,
            approved_at=datetime(2022, 10, 4, hour=16, tzinfo=timezone.utc),
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
