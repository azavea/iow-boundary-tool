import logging

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import get_template

from .models.user import Roles

logger = logging.getLogger(__name__)


def send_boundary_submitted_validator_email(request, boundary):
    (subject, body) = get_boundary_subject_and_body(
        request,
        boundary,
        subj_template_name='mail/boundary_submitted_validator_subject.txt',
        body_template_name='mail/boundary_submitted_validator_body.txt',
    )

    validators = boundary.utility.state.users.filter(role=Roles.VALIDATOR)
    validator_emails = [user.email for user in validators.only('email')]

    for email in validator_emails:
        safe_send_single_recipient_mail(subject, body, recipient=email)


def send_boundary_submitted_contributor_email(request, boundary):
    (subject, body) = get_boundary_subject_and_body(
        request,
        boundary,
        subj_template_name='mail/boundary_submitted_contributor_subject.txt',
        body_template_name='mail/boundary_submitted_contributor_body.txt',
    )

    for recipient in get_boundary_contributor_emails(boundary):
        safe_send_single_recipient_mail(subject, body, recipient)


def send_boundary_needs_revision_email(request, boundary):
    (subject, body) = get_boundary_subject_and_body(
        request,
        boundary,
        subj_template_name='mail/boundary_needs_revisions_subject.txt',
        body_template_name='mail/boundary_needs_revisions_body.txt',
    )

    for recipient in get_boundary_contributor_emails(boundary):
        safe_send_single_recipient_mail(subject, body, recipient)


def send_boundary_approved_email(request, boundary):
    (subject, body) = get_boundary_subject_and_body(
        request,
        boundary,
        subj_template_name='mail/boundary_approved_subject.txt',
        body_template_name='mail/boundary_approved_body.txt',
    )

    for recipient in get_boundary_contributor_emails(boundary):
        safe_send_single_recipient_mail(subject, body, recipient)


def get_boundary_subject_and_body(
    request,
    boundary,
    subj_template_name,
    body_template_name,
):
    subj_template = get_template(subj_template_name)
    body_template = get_template(body_template_name)

    template_data = get_boundary_template_data(request, boundary)

    subject = subj_template.render(template_data)
    body = body_template.render(template_data)

    return (subject, body)


def get_boundary_template_data(request, boundary):
    data = {
        "utility_name": boundary.utility.name,
        "pwsid": boundary.utility.pwsid,
        "details_link": "{}/submissions/{}/".format(
            make_iow_url(request),
            boundary.id,
        ),
    }

    if hasattr(boundary.latest_submission, 'review'):
        data['review_notes'] = boundary.latest_submission.review.notes

    return data


def get_boundary_contributor_emails(boundary):
    return boundary.utility.users.filter(role=Roles.CONTRIBUTOR).values_list(
        "email", flat=True
    )


def make_iow_url(request):
    if settings.ENVIRONMENT == 'Development':
        protocol = 'http'
        host = 'localhost:4545'
    else:
        protocol = 'https'
        host = request.get_host()

    return f'{protocol}://{host}'


def safe_send_single_recipient_mail(subject, body, recipient):
    try:
        send_mail(subject, body, from_email=None, recipient_list=[recipient])
    except Exception as exception:
        logger.error(
            "\n".join(
                [
                    'Could not send the following email:',
                    f'To: {recipient}',
                    f'Subject: {subject}',
                    'Body:',
                    body,
                    '',
                    'Caught exception:',
                    str(exception),
                ]
            ),
        )
