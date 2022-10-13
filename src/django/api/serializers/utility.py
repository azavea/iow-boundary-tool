from rest_framework.serializers import ModelSerializer

from ..models import Utility
from .state import StateIDSerializer


class UtilitySerializer(ModelSerializer):
    state = StateIDSerializer

    class Meta:
        model = Utility
        fields = "__all__"
