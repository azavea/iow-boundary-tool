import json

from django.urls import reverse

from rest_framework import status

from api.models import Submission, Utility

from .base import BoundarySyncAPITestCase


class ShapeUploadTests(BoundarySyncAPITestCase):
    polygon = {
        "type": "Polygon",
        "coordinates": [
            [
                [-78.63121032714844, 35.860117799832544],
                [-78.48701477050781, 35.72644736208901],
                [-78.73214721679688, 35.72421761691415],
                [-78.63121032714844, 35.860117799832544],
            ]
        ],
    }

    def setUp(self):
        self.otherutil = Utility.objects.get(pwsid='OTHERUTIL')
        self.client.force_login(self.contributor)

    def test_contributor_can_upload_shapefile(self):
        url = reverse("boundary_list")
        with open("api/tests/data/raleigh_triangle.zip", "rb") as shape:
            payload = {
                "shape": shape,
                "utility_id": self.otherutil.id,
            }

            response = self.client.post(url, payload)

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            boundary_id = response.content
            submission = Submission.objects.filter(boundary_id=boundary_id).first()

            self.assertDictEqual(json.loads(submission.shape.geojson), self.polygon)

    def test_contributor_can_upload_geojson(self):
        url = reverse("boundary_list")
        with open("api/tests/data/raleigh_triangle.geojson", "rb") as shape:
            payload = {
                "shape": shape,
                "utility_id": self.otherutil.id,
            }

            response = self.client.post(url, payload)

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            boundary_id = response.content
            submission = Submission.objects.filter(boundary_id=boundary_id).first()

            self.assertDictEqual(json.loads(submission.shape.geojson), self.polygon)

    def test_contributor_cannot_upload_other_files(self):
        url = reverse("boundary_list")
        with open("api/tests/data/raleigh_sanborn_map.jpg", "rb") as shape:
            payload = {
                "shape": shape,
                "utility_id": self.otherutil.id,
            }

            response = self.client.post(url, payload)

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
