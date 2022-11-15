from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.urls import reverse
from django.utils.html import format_html
from rest_framework.authtoken.models import TokenProxy

from .models.boundary import Boundary
from .models.reference_image import ReferenceImage
from .models.state import State
from .models.submission import Annotation, Approval, Review, Submission
from .models.user import User, Utility

contact_info_field_set = (
    "Contact Info",
    {
        "fields": (
            "full_name",
            "phone_number",
            "job_title",
        )
    },
)


class EmailAsUsernameUserAdmin(UserAdmin):
    list_display = ("email", "is_staff")
    search_fields = ("email",)
    ordering = ("email",)

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "password",
                    "role",
                    "utilities",
                    "states",
                    "send_password_reset_email",
                )
            },
        ),
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
        contact_info_field_set,
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
        contact_info_field_set,
    )
    readonly_fields = ('send_password_reset_email',)

    def send_password_reset_email(self, user):
        props = 'href="{}" style="padding: 8px;" class="button"'.format(
            reverse('send-password-reset', kwargs={"user_id": user.id})
        )

        return format_html(f'<a {props}>Send password reset email</a>')


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
