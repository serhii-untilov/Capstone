# Generated by Django 4.2.7 on 2023-11-21 05:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0004_person_rename_created_at_company_created_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='tax_id',
            field=models.CharField(default='', max_length=10),
        ),
        migrations.AlterField(
            model_name='company',
            name='owner',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]