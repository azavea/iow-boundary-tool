from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import Login, Logout
from .views.boundary import (
    BoundaryDetailView,
    BoundaryListView,
    BoundaryShapeView,
    BoundarySubmitView,
)
from .views.reference_image import ReferenceImageList, ReferenceImageDetail
from .views.review import ReviewCreateView

urlpatterns = [
    path("auth/login/", Login.as_view()),
    path("auth/logout/", Logout.as_view()),
    path("auth/", include("dj_rest_auth.urls")),
    path("boundaries/", BoundaryListView.as_view(), name="boundary_list"),
    path("boundaries/<int:id>/", BoundaryDetailView.as_view()),
    path("boundaries/<int:id>/shape/", BoundaryShapeView.as_view()),
    path("boundaries/<int:id>/submit/", BoundarySubmitView.as_view()),
    path(
        "boundaries/<int:boundary>/reference-images/",
        ReferenceImageList.as_view(),
        name="upload_image",
    ),
    path(
        "boundaries/<int:boundary>/reference-images/<int:pk>/",
        ReferenceImageDetail.as_view(),
        name="update_image",
    ),
    path(
        "boundaries/<int:boundary_id>/review",
        ReviewCreateView.as_view(),
        name='start_review',
    ),
]

urlpatterns = format_suffix_patterns(urlpatterns)
