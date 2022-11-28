from django.core.management import call_command
from django.core.management.base import BaseCommand

from api.tests import BoundarySyncAPITestCase


class Command(BaseCommand):
    help = "Reset the DB schema, run migrations, and create test data."

    def handle(self, *args, **options):
        call_command("reset_schema", "--noinput")
        call_command("migrate")
        BoundarySyncAPITestCase.setUpTestData()
