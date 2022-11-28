from django.urls import reverse
from django.utils.log import request_logger
from rest_framework import status

from api.models import ReferenceImage

from .base import BoundarySyncAPITestCase


class ReferenceImageViewTests(BoundarySyncAPITestCase):
    def setUp(self):
        super().setUp()
        self.test_image = open("api/tests/data/raleigh_sanborn_map.jpg", "rb")

    def tearDown(self):
        super().tearDown()
        self.test_image.close()

    def get_create_payload(self):
        return {
            "file": self.test_image,
            "filename": self.test_image.name,
            "is_visible": True,
            "opacity": 100,
            "uploaded_by": self.contributor.pk,
        }

    def get_update_payload(self):
        return {
            "filename": self.test_image.name,
            "is_visible": False,
            "distortion": {},
            "opacity": 100,
        }

    def test_no_image_list_endpoint(self):
        url = reverse("upload_image", args=[1])
        with self.assertLogs(request_logger, "WARNING"):
            response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # Contributor actions
    def test_contributor_upload_and_update_image(self):
        url = reverse("upload_image", args=[2])
        response = self.client.post(url, self.get_create_payload())

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReferenceImage.objects.filter(boundary__pk=2).count(), 1)

        update_url = reverse("update_image", args=[2, 1])
        # Attempt to alter the uploaded_by field, which is illegitimate.
        updated_image_illegitimate = {
            **self.get_update_payload(),
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
            response = self.client.post(url, self.get_create_payload())

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Validator actions
    def test_validator_cannot_upload_or_update_image(self):
        self.client.force_login(self.validator)
        url = reverse("upload_image", args=[1])
        with self.assertLogs(request_logger, "WARNING"):
            response = self.client.post(url, self.get_create_payload())

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        url = reverse("update_image", args=[1, 1])
        with self.assertLogs(request_logger, "WARNING"):
            response = self.client.put(url, self.get_update_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
