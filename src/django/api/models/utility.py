from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point

RALEIGH = Point(-78.6382, 35.7796)

__all__ = ["Utility"]


class Utility(models.Model):
    pwsid = models.CharField(max_length=9, unique=True)
    name = models.CharField(max_length=127)
    location = gis_models.PointField(geography=True, default=RALEIGH)

    class Meta:
        verbose_name_plural = "utilities"

    def __str__(self):
        return f"{self.name} ({self.pwsid})"
