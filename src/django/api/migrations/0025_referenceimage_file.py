# Generated by Django 3.2.13 on 2022-10-30 22:53

from django.db import migrations, models


def delete_all_reference_images(apps, schema_editor):
    ReferenceImage = apps.get_model('api', 'ReferenceImage')

    ReferenceImage.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_make_submission_shape_nullable'),
    ]

    operations = [
        migrations.RunPython(
            delete_all_reference_images,
            migrations.RunPython.noop
        ),
        migrations.AddField(
            model_name='referenceimage',
            name='file',
            field=models.FileField(upload_to=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='referenceimage',
            name='filename',
            field=models.CharField(max_length=255),
        ),
    ]
