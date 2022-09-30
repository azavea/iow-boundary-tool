from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.postgres.fields import CICharField

__all__ = ["State"]


class State(models.Model):
    id = CICharField(max_length=2, primary_key=True, unique=True)
    name = models.CharField(max_length=127)
    shape = gis_models.MultiPolygonField(geography=True)
    options = models.JSONField(
        blank=True,
        null=True,
        help_text='This JSON dictionary contains state-specific configuration.',
    )

    def __str__(self):
        return self.name
