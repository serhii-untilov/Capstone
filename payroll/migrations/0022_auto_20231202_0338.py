# Generated by Django 4.2.7 on 2023-12-02 03:38

from django.db import migrations

def populate_wage_per(apps, schema_editor):
    templates = [
        {'id': 1, 'name': 'Hour'},
        {'id': 2, 'name': 'Week'},
        {'id': 3, 'name': 'Month'},
        {'id': 4, 'name': 'Year'},
    ]
    WagePer = apps.get_model("payroll", "wagePer")
    for t in templates:
        accounting = WagePer()
        accounting.id = t['id']
        accounting.name = t['name']
        accounting.save()

class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0021_auto_20231202_0334'),
    ]

    operations = [
        migrations.RunPython(populate_wage_per),
    ]