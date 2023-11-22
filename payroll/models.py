from datetime import date
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class Company(models.Model):
    name = models.CharField(max_length=150)
    tax_id = models.CharField(max_length=10, default="", null=True)
    owner = models.ForeignKey("User", on_delete=models.CASCADE)
    date_from = models.DateField(default=date(1900, 1, 1))
    date_to = models.DateField(default=date(9999, 12, 31))
    is_demo = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.DateField(default=date(9999, 12, 31))

    def __str__(self):
        return self.name


class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    date_from = models.DateField(default=date(1900, 1, 1))
    date_to = models.DateField(default=date(9999, 12, 31))
    tax_id = models.CharField(max_length=10)
    email = models.EmailField(default="")
    user = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True, default="")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.DateField(default=date(9999, 12, 31))

    def __str__(self):
        return self.first_name + ' ' + self.last_name


class Employee(models.Model):
    company = models.ForeignKey("Company", on_delete=models.CASCADE)
    person = models.ForeignKey("Person", on_delete=models.SET_NULL, null=True, default="")
    date_from = models.DateField(auto_now_add=True)
    date_to = models.DateField(default=date(9999, 12, 31))
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.DateField(default=date(9999, 12, 31))

    def __str__(self):
        return self.company.name + ' ' + \
            self.person.first_name + ' ' + self.person.last_name + ' ' + \
            self.date_from + ' ' + self.date_to
