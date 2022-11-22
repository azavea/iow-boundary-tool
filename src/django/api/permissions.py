from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models.user import Roles


def request_is_read_only(request):
    return request.method in SAFE_METHODS


class UserCanReviewBoundaries(BasePermission):
    message = 'You are not able to review boundaries.'

    def has_permission(self, request, view):
        return request_is_read_only(request) or (
            request.user.role == Roles.VALIDATOR
            or request.user.role == Roles.ADMINISTRATOR
        )


class UserCanWriteBoundaries(BasePermission):
    message = 'You are not able to write boundaries.'

    def has_permission(self, request, view):
        return request_is_read_only(request) or (
            request.user.role == Roles.CONTRIBUTOR
            or request.user.role == Roles.ADMINISTRATOR
        )


class UserCanUnapproveBoundaries(BasePermission):
    message = 'You are not able to unapprove boundaries.'

    def has_permission(self, request, view):
        return request_is_read_only(request) or (
            request.user.role == Roles.VALIDATOR
            or request.user.role == Roles.ADMINISTRATOR
        )


class UserIsAdmin(BasePermission):
    message = 'You are not an administrator.'

    def has_permission(self, request, view):
        if not request.user.is_active:
            return False

        return request.user.role == Roles.ADMINISTRATOR
