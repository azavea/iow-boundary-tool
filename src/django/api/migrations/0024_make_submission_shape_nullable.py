# Generated by Django 3.2.13 on 2022-10-24 22:27

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_referenceimage_opacity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='submission',
            name='shape',
            field=django.contrib.gis.db.models.fields.PolygonField(
                geography=True, null=True, srid=4326),
        ),
    ]