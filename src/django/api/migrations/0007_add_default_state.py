# Generated by Django 3.2.13 on 2022-09-29 22:41

from django.conf import settings
from django.db import migrations
from django.contrib.gis.geos import MultiPolygon


def add_default_state_nc(apps, schema_editor):
    # Utility relies on a many-to-one relationship with State
    # We should populate db with a State so we have ability to
    # add upcoming state field on Utility with default FK id
    State = apps.get_model('api', 'State')

    NC_STATE = State(id="NC", name="North Carolina", shape=MultiPolygon([]))
    NC_STATE.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_create_state'),
    ]

    operations = [
        migrations.RunPython(add_default_state_nc, migrations.RunPython.noop),
    ]
