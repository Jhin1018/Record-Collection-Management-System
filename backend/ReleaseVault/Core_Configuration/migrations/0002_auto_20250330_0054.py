# Generated by Django 2.2.24 on 2025-03-30 00:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core_Configuration', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(default=123456, max_length=128),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
