# Generated by Django 3.2.13 on 2022-11-03 18:00

import api.models.submission
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_submission_upload_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='approval',
            name='unapproved_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='approval',
            name='unapproved_by',
            field=models.ForeignKey(blank=True, limit_choices_to=api.models.submission.limit_by_validator_or_admin, null=True,
                                    on_delete=django.db.models.deletion.PROTECT, related_name='unapprover', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='approval',
            name='approved_by',
            field=models.ForeignKey(limit_choices_to=api.models.submission.limit_by_validator_or_admin,
                                    on_delete=django.db.models.deletion.PROTECT, related_name='approver', to=settings.AUTH_USER_MODEL),
        ),
    ]