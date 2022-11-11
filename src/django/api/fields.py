import json
import os
import tempfile
from pathlib import Path

import fiona
from django.contrib.gis.geos import GEOSGeometry
from rest_framework.fields import FileField
from rest_framework.serializers import ValidationError


class ShapefileField(FileField):
    def to_internal_value(self, data):
        if data.name.endswith(".zip"):
            # Treat like a zipped shapefile
            try:
                tmpdir = tempfile.mkdtemp()
                tmpfile = Path(f"{tmpdir}/{data.name}")
                with open(tmpfile, "wb+") as f:
                    for chunk in data.chunks():
                        f.write(chunk)

                with fiona.open(f"zip://{tmpfile}") as f:
                    # TODO Capture all features in the shapefile, not just first
                    geojson = json.dumps(f[0]["geometry"])
                    return GEOSGeometry(geojson)

            except Exception:
                raise ValidationError(
                    f"Could not parse {data.name} as a zipped shapefile."
                )

            finally:
                os.remove(tmpfile)
                os.rmdir(tmpdir)

        if data.name.endswith(".geojson"):
            geojson = data.read()
            return GEOSGeometry(geojson)

        raise ValidationError(
            f"Incompatible file: {data.name}."
            " Must be either a zipped shapefile, or a geojson."
        )
