import logging

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import get_template

from .models.user import Roles

logger = logging.getLogger(__name__)


def send_boundary_submitted_validator_email(request, updated_boundary):
    subj_template = get_template('mail/boundary_submitted_validator_subject.txt')
    body_template = get_template('mail/boundary_submitted_validator_body.txt')

    validators = updated_boundary.utility.state.users.filter(role=Roles.VALIDATOR)
    validator_emails = [user.email for user in validators.only('email')]

    template_data = {
        "city": updated_boundary.utility.address_city,
        "pwsid": updated_boundary.utility.pwsid,
        "details_link": "{}/submissions/{}/".format(
            make_iow_url(request),
            updated_boundary.id,
        ),
    }

    subject = subj_template.render(template_data)
    body = body_template.render(template_data)

    for email in validator_emails:
        try:
            send_mail(
                subject,
                body,
                from_email=None,
                recipient_list=[email],
            )
        except Exception as exception:
            logger.error(
                'Could not send validator update email to %s. Caught exception:\n%s',
                (email, exception),
            )


def make_iow_url(request):
    if settings.ENVIRONMENT == 'Development':
        protocol = 'http'
        host = 'localhost:4545'
    else:
        protocol = 'https'
        host = request.get_host()

    return f'{protocol}://{host}'
