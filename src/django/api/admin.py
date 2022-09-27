from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from rest_framework.authtoken.models import TokenProxy
from .models.user import User, Utility
from .models.state import State


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


admin.site.register(User, EmailAsUsernameUserAdmin)
admin.site.register(Utility)
admin.site.unregister(TokenProxy)
admin.site.register(State)
