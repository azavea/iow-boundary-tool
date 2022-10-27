from rest_framework.fields import FileField

from django.contrib.gis.geos import Polygon


class ShapefileField(FileField):
    def to_internal_value(self, data):
        # shapefile = super().to_internal_value(data)
        return Polygon()
