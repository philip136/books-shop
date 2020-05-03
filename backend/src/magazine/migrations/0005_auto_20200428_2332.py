# Generated by Django 3.0.3 on 2020-04-28 23:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('magazine', '0004_auto_20200428_2320'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='roomorder',
            options={'verbose_name': 'Комната клиент-курьер', 'verbose_name_plural': 'Комнаты клиент-курьер'},
        ),
        migrations.RemoveField(
            model_name='location',
            name='description',
        ),
        migrations.AddField(
            model_name='location',
            name='profile',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='magazine.Profile'),
        ),
    ]
