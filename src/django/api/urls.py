from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = [
    path("auth/login/", views.Login.as_view()),
    path("auth/logout/", views.Logout.as_view()),
    path("auth/", include("dj_rest_auth.urls")),
]
urlpatterns = format_suffix_patterns(urlpatterns)
