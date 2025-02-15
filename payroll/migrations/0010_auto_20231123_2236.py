# Generated by Django 4.2.7 on 2023-11-23 22:36

from django.db import migrations

def populate_accounting(apps, schema_editor):
    templates = [
        {'id': 1, 'name': 'General rules'},
        {'id': 2, 'name': 'Kindergarten'},
        {'id': 3, 'name': 'Services'},
        {'id': 4, 'name': 'Trade'},
    ]
    Accounting = apps.get_model("payroll", "accounting")
    for t in templates:
        accounting = Accounting()
        accounting.id = t['id']
        accounting.name = t['name']
        accounting.save()

class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0009_accounting_company_accounting'),
    ]

    operations = [
        migrations.RunPython(populate_accounting),
    ]
