import logging
from smtplib import SMTPException

from django.conf import settings
from django.core.mail import send_mail

from .models.user import Roles

logger = logging.getLogger(__name__)


def send_validator_update_email(request, updated_boundary):
    validators = updated_boundary.utility.state.users.filter(
        role=Roles.VALIDATOR
    )

    validator_emails = [user.email for user in validators.only('email')]

    subject = "Submission for review - {} {}".format(
        updated_boundary.utility.address_city,
        updated_boundary.utility.pwsid,
    )

    review_link = "{}/submissions/{}/".format(
        make_iow_url(request),
        updated_boundary.id,
    )

    body = "\n".join([
        subject,
        "",
        "A new boundary has been submitted for review.",
        "",
        "Review submission:",
        format(review_link),
    ])

    for email in validator_emails:
        try:
            send_mail(
                subject,
                body,
                from_email=None,
                recipient_list=[email],
            )
        except SMTPException:
            logger.error(
                'Could not send validator update email to {}'.format(email),
            )


def make_iow_url(request):
    if settings.ENVIRONMENT == 'Development':
        protocol = 'http'
        host = 'localhost:4545'
    else:
        protocol = 'https'
        host = request.get_host()

    return '{}://{}'.format(protocol, host)
