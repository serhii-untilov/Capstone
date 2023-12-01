# Generated by Django 4.2.7 on 2023-12-01 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0014_company_check_date_company_pay_period'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='deleted',
        ),
        migrations.AddField(
            model_name='employee',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
