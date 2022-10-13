from django.db import models

from .boundary import Boundary
from .user import User

__all__ = ["ReferenceImage"]


class ReferenceImage(models.Model):
    filename = models.CharField(max_length=255, blank=True)
    boundary = models.ForeignKey(
        Boundary, on_delete=models.PROTECT, related_name='reference_images'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.PROTECT)
    is_visible = models.BooleanField(default=True)
    distortion = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.filename
