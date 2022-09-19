from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models.user import User, Utility


class EmailAsUsernameUserAdmin(UserAdmin):
    list_display = ("email", "is_staff")
    search_fields = ("email",)
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password", "role", "utility")}),
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
                    "utility",
                ),
            },
        ),
    )


admin.site.register(User, EmailAsUsernameUserAdmin)
admin.site.register(Utility)
