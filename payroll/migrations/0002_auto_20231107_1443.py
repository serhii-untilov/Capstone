# Generated by Django 4.2.7 on 2023-11-07 14:43

from django.db import migrations


def populate_groups(apps, schema_editor):
    templates = [
        {'id': 1, 'name': 'Manager'},
        {'id': 2, 'name': 'Employee'},
    ]
    Group = apps.get_model("auth", "group")
    for t in templates:
        group = Group()
        group.id = t['id']
        group.name = t['name']
        group.save()


class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_groups),
    ]
