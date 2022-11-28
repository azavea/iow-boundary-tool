from rest_framework.serializers import ModelSerializer

from ..models import User
from .utility import UtilitySerializer


class UserSerializer(ModelSerializer):
    utilities = UtilitySerializer(many=True)

    class Meta:
        model = User
        fields = ("email", "role", "utilities")
