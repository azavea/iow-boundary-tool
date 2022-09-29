from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.utils import timezone

from .role import Role, Roles
from .utility import Utility
from .state import State

__all__ = ["EmailAsUsernameUserManager", "User"]


class EmailAsUsernameUserManager(BaseUserManager):
    """Manager for User objects with required role and email identifier."""

    use_in_migrations = True

    def _create_user(self, email, role, password=None, **extra_fields):
        if not email:
            raise ValueError("An email address must be provided.")
        if not role:
            raise ValueError("A role must be provided.")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, email, role, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, role, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        admin_role = Role.objects.get(pk=Roles.ADMINISTRATOR)
        return self._create_user(email, admin_role, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Treats email as the unique identifier."""

    USERNAME_FIELD = "email"
    objects = EmailAsUsernameUserManager()

    email = models.EmailField(unique=True, validators=[EmailValidator])
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    role = models.ForeignKey(
        Role,
        related_name="actors",
        on_delete=models.PROTECT,
        default=Roles.CONTRIBUTOR,
    )

    utilities = models.ManyToManyField(
        Utility,
        blank=True,
        related_name="users",
    )

    states = models.ManyToManyField(
        State,
        blank=True,
        related_name="users",
    )

    def clean(self):
        if (
            self.id
            and self.role.pk == Roles.CONTRIBUTOR
            and not self.utilities.exists()
        ):
            raise ValidationError("Contributors must be assigned a utility.")

        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def __str__(self):
        return self.email