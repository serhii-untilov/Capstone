# Generated by Django 4.2.7 on 2023-11-23 08:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0006_company_is_demo_alter_company_tax_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Laws',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='company',
            name='laws',
            field=models.ForeignKey(default='', null=True, on_delete=django.db.models.deletion.SET_NULL, to='payroll.laws'),
        ),
    ]
