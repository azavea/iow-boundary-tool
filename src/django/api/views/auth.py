from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from dj_rest_auth.views import LoginView, LogoutView

from django.contrib.auth import authenticate, login, logout


class Login(LoginView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if email is None or password is None:
            raise AuthenticationFailed("Email and password are required")

        user = authenticate(email=email, password=password)

        if user is None:
            raise AuthenticationFailed("Unable to login with those credentials")

        login(request, user)

        return Response(status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        if not request.user.is_active:
            raise AuthenticationFailed("Unable to sign in")

        return Response(status=status.HTTP_204_NO_CONTENT)


class Logout(LogoutView):
    def post(self, request, *args, **kwargs):
        logout(request)

        return Response(status=status.HTTP_204_NO_CONTENT)
