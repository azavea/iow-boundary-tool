from django.urls import path

from .views import environment

urlpatterns = [
    path('environment.js', environment),
]
