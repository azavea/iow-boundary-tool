from django.core.management import call_command
from django.core.management.base import BaseCommand

from api.models import Role, Utility, User


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
        )
        User.objects.create_user(
            email="v1@azavea.com",
            password="password",
            role=Role.objects.get(description="VALIDATOR"),
        )
        contributor = User.objects.create_user(
            email="c1@azavea.com",
            password="password",
            role=Role.objects.get(description="CONTRIBUTOR"),
        )
        contributor.utilities.add(test_utility)
