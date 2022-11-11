from rest_framework.fields import BooleanField, CharField
from rest_framework.serializers import ModelSerializer, Serializer

from ..models.submission import Annotation


class NewAnnotationSerializer(ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['location', 'comment']


class UpdateAnnotationSerializer(Serializer):
    comment = CharField()
    resolved = BooleanField(required=False, default=False)
