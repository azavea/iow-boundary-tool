from rest_framework.exceptions import APIException


class ForbiddenException(APIException):
    status_code = 403
    default_detail = 'You are not allowed to perform this action.'
    default_code = 'forbidden'


class BadRequestException(APIException):
    status_code = 400
    default_detail = 'There was a problem with your request.'
    default_code = 'bad_request'
