# Generated by Django 3.2.13 on 2022-10-13 16:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_referenceimage_uploaded_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='referenceimage',
            name='boundary',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='reference_images', to='api.boundary'),
        ),
    ]
