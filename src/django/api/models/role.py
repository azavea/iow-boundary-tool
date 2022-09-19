from enum import Enum, unique
from django.db import models

__all__ = ["Role"]


@unique
class Roles(Enum):
    """Corresponds to the order of pks in initial migration
    0002_create_initial_roles."""

    ADMINISTRATOR = 1
    VALIDATOR = 2
    CONTRIBUTOR = 3


class Role(models.Model):
    description = models.CharField(max_length=24, unique=True)

    def clean(self):
        super().clean()
        self.description = self.description.upper()

    def __str__(self):
        return self.description
