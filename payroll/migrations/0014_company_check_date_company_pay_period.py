# Generated by Django 4.2.7 on 2023-12-01 07:00

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0013_alter_employee_person_alter_person_email_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='check_date',
            field=models.DateField(default=datetime.date(1900, 1, 1)),
        ),
        migrations.AddField(
            model_name='company',
            name='pay_period',
            field=models.DateField(default=datetime.date(1900, 1, 1)),
        ),
    ]
