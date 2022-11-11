from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from rest_framework.authtoken.models import TokenProxy

from .models.boundary import Boundary
from .models.reference_image import ReferenceImage
from .models.state import State
from .models.submission import Annotation, Approval, Review, Submission
from .models.user import User, Utility


class EmailAsUsernameUserAdmin(UserAdmin):
    list_display = ("email", "is_staff")
    search_fields = ("email",)
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password", "role", "utilities", "states")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "role",
                    "utilities",
                ),
            },
        ),
    )


submission_stage_models = [
    Boundary,
    ReferenceImage,
    Submission,
    Review,
    Approval,
    Annotation,
]

admin.site.register(User, EmailAsUsernameUserAdmin)
admin.site.register(Utility)
admin.site.unregister(TokenProxy)
admin.site.register(State)
admin.site.register(submission_stage_models)
