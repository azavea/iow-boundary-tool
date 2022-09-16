from django.db import models

__all__ = ["Role"]


class Role(models.Model):
    description = models.CharField(max_length=24, unique=True)

    @classmethod
    def get_contributor_pk(cls):
        return cls.objects.get_or_create(description="CONTRIBUTOR")[0].pk

    def clean(self):
        super().clean()
        self.description = self.description.upper()

    def __str__(self):
        return self.description
