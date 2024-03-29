from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.db import models
from django.utils.functional import cached_property

from .state import State

RALEIGH = Point(-78.6382, 35.7796)


__all__ = ["Utility"]


class Utility(models.Model):
    pwsid = models.CharField(max_length=9, unique=True)
    name = models.CharField(max_length=127)
    location = gis_models.PointField(geography=True, default=RALEIGH)
    state = models.ForeignKey(State, on_delete=models.PROTECT, default="NC")

    address_line_1 = models.CharField(max_length=127)
    address_line_2 = models.CharField(max_length=127, blank=True)
    address_city = models.CharField(max_length=127)
    address_zip_code = models.CharField(max_length=10)

    class Meta:
        verbose_name_plural = "utilities"

    def __str__(self):
        return f"{self.pwsid} - {self.name}"

    @cached_property
    def compact_name(self):
        alphanum_name = "".join(c for c in self.name if c.isalnum())
        alphanum_city = "".join(c for c in self.address_city if c.isalnum())

        return f"{alphanum_name}{alphanum_city}"
