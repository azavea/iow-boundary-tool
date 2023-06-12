import csv
import logging
import sys
from datetime import datetime

import boto3
from botocore.exceptions import ClientError
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from api.models import Roles, User, Utility


class Command(BaseCommand):
    help = "Create User models from a CSV file in S3"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.logger = logging.getLogger("django")
        self.logfile = f"create_contributors_from_s3_{datetime.now().isoformat()}.log"

        file_handler = logging.FileHandler(self.logfile)
        formatter = logging.Formatter("%(asctime)s %(levelname)s: %(message)s")

        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

    def add_arguments(self, parser):
        parser.add_argument("bucket_name", type=str, help="Name of the S3 bucket")
        parser.add_argument(
            "csv_file_key", type=str, help="Key of the CSV file in the S3 bucket"
        )

    def handle(self, *args, **options):
        bucket_name = options["bucket_name"]
        csv_file_key = options["csv_file_key"]
        s3 = boto3.client("s3")

        try:
            # Fetch the specified CSV file from S3
            response = s3.get_object(Bucket=bucket_name, Key=csv_file_key)
            content = response["Body"].read().decode("utf-8")
            reader = csv.DictReader(content.splitlines())

            # We process the CSV file atomically, so if there's any errors encountered,
            # the entire import is cancelled
            with transaction.atomic():
                try:
                    for row in reader:
                        # Create a user with specified utilities for each row in CSV
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
                                self.logger.error(
                                    f"Invalid PWSID '{pwsid}' "
                                    f"for contributor {user.email}"
                                )
                                raise

                        user.utilities.set(utilities)

                        utilities_str = ", ".join(
                            [str(ut) for ut in user.utilities.all()]
                        )

                        self.logger.info(
                            f"Successfully created contributor {user.email}, "
                            f"associated with {utilities_str}"
                        )

                except Exception as e:
                    self.logger.error(
                        f"Error occurred during contributor creation: {str(e)}"
                    )
                    transaction.set_rollback(True)
                    sys.exit(1)
        except ClientError as e:
            self.logger.error(f"Error occurred while accessing the CSV file: {str(e)}")
        finally:
            if settings.ENVIRONMENT != "Development":
                # Upload log to S3
                log_file_key = f"management/{self.logfile}"
                s3.upload_file(
                    self.logfile, settings.AWS_LOGS_BUCKET_NAME, log_file_key
                )
