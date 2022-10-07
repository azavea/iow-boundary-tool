from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import Login, Logout
from .views.boundary import BoundaryListView

urlpatterns = [
    path("auth/login/", Login.as_view()),
    path("auth/logout/", Logout.as_view()),
    path("auth/", include("dj_rest_auth.urls")),
    path("boundaries/", BoundaryListView.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
