# Generated by Django 4.2.7 on 2023-11-23 08:45

from django.db import migrations

def populate_laws(apps, schema_editor):
    templates = [
        {'id': 1, 'name': 'Ukraine'},
    ]
    Laws = apps.get_model("payroll", "laws")
    for t in templates:
        laws = Laws()
        laws.id = t['id']
        laws.name = t['name']
        laws.save()


class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0007_laws_company_laws'),
    ]

    operations = [
        migrations.RunPython(populate_laws),
    ]
