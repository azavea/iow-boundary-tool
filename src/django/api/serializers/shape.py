from django.contrib.gis.geos import Polygon
from rest_framework.fields import FileField, FloatField, ListField
from rest_framework.serializers import Serializer

from api.fields import ShapefileField


class ShapeSerializer(Serializer):
    coordinates = ListField(
        child=ListField(
            child=ListField(child=FloatField(), min_length=2, max_length=2),
            min_length=3,
        ),
        min_length=1,
        max_length=1,
    )

    def to_internal_value(self, data):
        validated_data = super().to_internal_value(data)
        coordinates = validated_data['coordinates']

        if not ShapeSerializer.coordinates_are_closed(coordinates):
            coordinates = ShapeSerializer.get_closed_coordinates(coordinates)

        return Polygon(*coordinates)

    @staticmethod
    def coordinates_are_closed(coordinates):
        return coordinates[0][-1] == coordinates[0][0]

    @staticmethod
    def get_closed_coordinates(coordinates):
        coordinates[0].append(coordinates[0][0])
        return coordinates


class ShapeUpdateSerializer(Serializer):
    shape = ShapeSerializer(required=False)
    file = ShapefileField(required=False)
    upload_file = FileField(required=False)
