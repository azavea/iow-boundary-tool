from datetime import datetime, timezone

from django.core.management import call_command
from django.core.management.base import BaseCommand

from api.models import Utility, User
from api.models.boundary import Boundary
from api.models.user import Roles
from api.models.submission import Approval, Submission

from ..test_shapes import (
    RALEIGH_FAKE_RECTANGLE,
    RALEIGH_FAKE_TRIANGLE,
    RALEIGH_FAKE_ZIGZAG,
)


class Command(BaseCommand):
    help = "Reset the DB schema, run migrations, and create test data."

    def handle(self, *args, **options):
        call_command("reset_schema", "--noinput")
        call_command("migrate")

        # Create test utility located in Raleigh.
        test_utility = Utility(pwsid="123456789", name="Azavea Test Utility")
        test_utility.save()

        # Create test users.
        User.objects.create_superuser(
            email="a1@azavea.com",
            password="password",
            has_admin_generated_password=False,
        )
        validator = User.objects.create_user(
            email="v1@azavea.com",
            password="password",
            has_admin_generated_password=False,
            role=Roles.VALIDATOR,
        )
        contributor = User.objects.create_user(
            email="c1@azavea.com",
            password="password",
            has_admin_generated_password=False,
            role=Roles.CONTRIBUTOR,
        )
        contributor.utilities.add(test_utility)

        # Create test boundary and submissions.
        # Use tz-aware datetimes to avoid warnings.
        boundary = Boundary.objects.create(utility=test_utility)

        # draft
        Submission.objects.create(
            boundary=boundary,
            shape=RALEIGH_FAKE_ZIGZAG,
            created_at=datetime(2022, 10, 3, hour=15, tzinfo=timezone.utc),
            created_by=contributor,
        )

        # submitted
        Submission.objects.create(
            boundary=boundary,
            shape=RALEIGH_FAKE_TRIANGLE,
            created_at=datetime(2022, 10, 2, hour=11, tzinfo=timezone.utc),
            created_by=contributor,
            submitted_at=datetime(2022, 10, 2, hour=12, tzinfo=timezone.utc),
            submitted_by=contributor,
            notes="Notes for the test submission.",
        )

        approved = Submission.objects.create(
            boundary=boundary,
            shape=RALEIGH_FAKE_RECTANGLE,
            created_at=datetime(2022, 10, 1, hour=8, tzinfo=timezone.utc),
            created_by=contributor,
            submitted_at=datetime(2022, 10, 1, hour=9, tzinfo=timezone.utc),
            submitted_by=contributor,
            notes="Notes for the test approved boundary.",
        )

        Approval.objects.create(
            submission=approved,
            approved_at=datetime(2022, 10, 4, hour=16, tzinfo=timezone.utc),
            approved_by=validator,
        )
