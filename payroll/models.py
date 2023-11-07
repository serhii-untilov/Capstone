from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class Company(models.Model):
    name=models.CharField(max_length=150)

    def __str__(self):
        return self.name