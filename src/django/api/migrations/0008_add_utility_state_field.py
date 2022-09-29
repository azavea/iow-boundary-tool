# Generated by Django 3.2.13 on 2022-09-29 22:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_add_default_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='utility',
            name='state',
            field=models.ForeignKey(default="NC", on_delete=django.db.models.deletion.PROTECT, to='api.state'),
        ),
    ]