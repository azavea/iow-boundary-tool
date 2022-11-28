from rest_framework.exceptions import APIException


class BadRequestException(APIException):
    status_code = 400
    default_detail = 'There was a problem with your request.'
    default_code = 'bad_request'
