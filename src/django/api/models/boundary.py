from django.db import models

from .utility import Utility

__all__ = ["Boundary"]


class Boundary(models.Model):
    utility = models.ForeignKey(Utility, on_delete=models.PROTECT)
    archived_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "boundaries"

    def __str__(self):
        return f"{self.utility} Boundary"
