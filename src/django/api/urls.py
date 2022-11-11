from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import Login, Logout
from .views.annotations import AnnotationCreateView, AnnotationUpdateView
from .views.boundary import (
    BoundaryApproveView,
    BoundaryDetailView,
    BoundaryDraftView,
    BoundaryListView,
    BoundaryShapeView,
    BoundarySubmitView,
    BoundaryUnapproveView,
)
from .views.reference_image import ReferenceImageDetail, ReferenceImageList
from .views.review import ReviewCreateView, ReviewFinishView

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
    path(
        "boundaries/<int:boundary_id>/review/finish/",
        ReviewFinishView.as_view(),
        name='finish_review',
    ),
    path(
        "boundaries/<int:boundary_id>/review/annotations/",
        AnnotationCreateView.as_view(),
        name='create_annotation',
    ),
    path(
        "boundaries/<int:boundary_id>/review/annotations/<int:annotation_id>/",
        AnnotationUpdateView.as_view(),
        name='update_annotation',
    ),
    path(
        "boundaries/<int:boundary_id>/draft/",
        BoundaryDraftView.as_view(),
        name='start_draft',
    ),
    path(
        "boundaries/<int:boundary_id>/approve/",
        BoundaryApproveView.as_view(),
        name='approve_boundary',
    ),
    path(
        "boundaries/<int:boundary_id>/unapprove/",
        BoundaryUnapproveView.as_view(),
        name='unapprove_boundary',
    ),
]

urlpatterns = format_suffix_patterns(urlpatterns)
