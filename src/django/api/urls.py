from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = [
    path('example/', views.example),
]
urlpatterns = format_suffix_patterns(urlpatterns)
