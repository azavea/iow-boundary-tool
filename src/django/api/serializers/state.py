from rest_framework.serializers import ModelSerializer

from ..models import State


class StateIDSerializer(ModelSerializer):
    """Serializes State as its two letter abbreviation"""

    class Meta:
        model = State
        fields = ["id"]
