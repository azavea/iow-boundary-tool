from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    ChoiceField,
    DateTimeField,
)

from ..models.boundary import Boundary, BOUNDARY_STATUS


class StatusField(ChoiceField):
    def __init__(self):
        super().__init__(choices=[status for status in BOUNDARY_STATUS])

    def to_representation(self, status):
        return status.value


class BoundaryListSerializer(ModelSerializer):
    location = CharField(source='utility.name')
    pwsid = CharField(source='utility.pwsid')
    last_modified = DateTimeField()
    status = StatusField()

    class Meta:
        model = Boundary
        fields = ['id', 'location', 'pwsid', 'last_modified', 'status']
