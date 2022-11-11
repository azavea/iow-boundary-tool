from dj_rest_auth.serializers import PasswordResetConfirmSerializer
from django.db import transaction


class UserChosenPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    @transaction.atomic
    def save(self):
        self.user.has_admin_generated_password = False
        self.user.save()

        return self.set_password_form.save()
