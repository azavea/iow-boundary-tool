from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import Login, Logout
from .views.boundary import BoundaryDetailView, BoundaryListView
from .views.reference_image import ReferenceImageList, ReferenceImageDetail

urlpatterns = [
    path("auth/login/", Login.as_view()),
    path("auth/logout/", Logout.as_view()),
    path("auth/", include("dj_rest_auth.urls")),
    path("boundaries/", BoundaryListView.as_view()),
    path("boundaries/<int:id>/", BoundaryDetailView.as_view()),
    path("boundaries/<int:boundary>/reference-images/", ReferenceImageList.as_view()),
    path(
        "boundaries/<int:boundary>/reference-images/<int:pk>/",
        ReferenceImageDetail.as_view(),
    ),
]

urlpatterns = format_suffix_patterns(urlpatterns)
