# Generated by Django 4.2.7 on 2023-11-28 13:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0012_alter_person_email_alter_person_last_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payroll.person'),
        ),
        migrations.AlterField(
            model_name='person',
            name='email',
            field=models.EmailField(blank=True, default='', max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='last_name',
            field=models.CharField(blank=True, default='', max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='middle_name',
            field=models.CharField(blank=True, default='', max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='tax_id',
            field=models.CharField(blank=True, default='', max_length=10, null=True),
        ),
    ]
