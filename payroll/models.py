from datetime import date
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass

class Law(models.Model):
    name = models.CharField(max_length=50)

class Accounting(models.Model):
    name = models.CharField(max_length=50)

class Company(models.Model):
    name = models.CharField(max_length=150)
    law = models.ForeignKey("Law", on_delete=models.SET_NULL, null=True, default='')
    tax_id = models.CharField(max_length=10, default="", null=True)
    accounting = models.ForeignKey("Accounting", on_delete=models.SET_NULL, null=True, default='')
    owner = models.ForeignKey("User", on_delete=models.CASCADE)
    date_from = models.DateField(default=date(1900, 1, 1))
    date_to = models.DateField(default=date(9999, 12, 31))
    pay_period = models.DateField(default=date(1900, 1, 1))
    check_date = models.DateField(default=date(1900, 1, 1))
    is_demo = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.DateField(default=date(9999, 12, 31))

    def __str__(self):
        return self.name

class Department(models.Model):
    company = models.ForeignKey("Company", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)

class Job(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)

class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, null=True, default="", blank=True)
    middle_name = models.CharField(max_length=30, null=True, default="", blank=True)
    date_from = models.DateField(default=date(1900, 1, 1))
    date_to = models.DateField(default=date(9999, 12, 31))
    tax_id = models.CharField(max_length=10, null=True, default="", blank=True)
    email = models.EmailField(null=True, default="", blank=True)
    user = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True, default="")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.DateField(default=date(9999, 12, 31))

    def __str__(self):
        return self.first_name + ' ' + self.last_name



class Employee(models.Model):
    company = models.ForeignKey("Company", on_delete=models.CASCADE)
    person = models.ForeignKey("Person", on_delete=models.PROTECT)
    date_from = models.DateField(auto_now_add=True)
    date_to = models.DateField(default=date(9999, 12, 31))
    department = models.ForeignKey("Department", on_delete=models.PROTECT, null=True, default=None, blank=True)
    job = models.ForeignKey("Job", on_delete=models.PROTECT, null=True, default=None, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.company.name + ' ' + \
            self.person.first_name + ' ' + self.person.last_name + ' ' + \
            self.date_from + ' ' + self.date_to

