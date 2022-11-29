import json
import os
import tempfile
from pathlib import Path

import fiona
from django.contrib.gis.geos import GEOSGeometry
from rest_framework.fields import FileField
from rest_framework.serializers import ValidationError


def get_polygon_geometry(geojson):
    if isinstance(geojson, (str, bytes)):
        try:
            geojson = json.loads(geojson)
        except Exception:
            raise ValidationError("Could not parse GeoJSON: Decoding error")

    t = geojson.get("type")
    g = None

    if t not in ["FeatureCollection", "Feature", "Polygon"]:
        raise ValidationError(f"Could not parse GeoJSON: Invalid type '{t}'")

    if t == "FeatureCollection":
        features = geojson.get("features", [])
        features = [f for f in features if f["geometry"]["type"] == "Polygon"]
        g = features[0]["geometry"] if features else None

    if t == "Feature":
        g = geojson["geometry"]

    if t == "Polygon":
        g = geojson

    if not g:
        raise ValidationError("Could not parse geometry from given GeoJSON")

    return json.dumps(g)


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
            geom = get_polygon_geometry(geojson)
            return GEOSGeometry(geom)

        raise ValidationError(
            f"Incompatible file: {data.name}."
            " Must be either a zipped shapefile, or a geojson."
        )
