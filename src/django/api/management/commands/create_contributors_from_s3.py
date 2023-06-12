import csv

import boto3
from botocore.exceptions import ClientError
from django.core.management.base import BaseCommand
from django.db import transaction

from api.models import Roles, User, Utility


class Command(BaseCommand):
    help = "Create User models from a CSV file in S3"

    def add_arguments(self, parser):
        parser.add_argument("bucket_name", type=str, help="Name of the S3 bucket")
        parser.add_argument(
            "csv_file_key", type=str, help="Key of the CSV file in the S3 bucket"
        )

    def handle(self, *args, **options):
        bucket_name = options["bucket_name"]
        csv_file_key = options["csv_file_key"]

        try:
            s3 = boto3.client("s3")
            response = s3.get_object(Bucket=bucket_name, Key=csv_file_key)
            content = response["Body"].read().decode("utf-8")

            reader = csv.DictReader(content.splitlines())
            with transaction.atomic():
                try:
                    for row in reader:
                        user = User.objects.create_user(
                            email=row["email"],
                            role=Roles.CONTRIBUTOR,
                            password=row["password"],
                            full_name=row["full_name"],
                            phone_number=row["phone_number"],
                            job_title=row["job_title"],
                        )

                        # Associate with utilities matching given ; separated PWSIDs.
                        # We don't use .filter(pwsid__in) here because we want to fail
                        # if any given PWSID is not found in the system to call out
                        # mistakes in input CSV.
                        pwsids = row["pwsids"].split(";")
                        utilities = []
                        for pwsid in pwsids:
                            try:
                                utilities.append(Utility.objects.get(pwsid=pwsid))
                            except Utility.DoesNotExist:
                                self.stderr.write(
                                    f"Invalid PWSID '{pwsid}' "
                                    f"for contributor {user.email}"
                                )
                                raise

                        user.utilities.set(utilities)

                        utilities_str = ", ".join(
                            [str(ut) for ut in user.utilities.all()]
                        )

                        self.stdout.write(
                            f"Successfully created contributor {user.email}, "
                            f"associated with {utilities_str}"
                        )

                except Exception as e:
                    self.stderr.write(
                        f"Error occurred during contributor creation: {str(e)}"
                    )
                    transaction.set_rollback(True)
        except ClientError as e:
            self.stderr.write(f"Error occurred while accessing the CSV file: {str(e)}")
