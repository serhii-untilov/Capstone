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
    law = models.ForeignKey(
        "Law", on_delete=models.SET_NULL, null=True, default='')
    tax_id = models.CharField(max_length=10, default="", null=True)
    accounting = models.ForeignKey(
        "Accounting", on_delete=models.SET_NULL, null=True, default='')
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


class EmploymentStatus(models.Model):
    name = models.CharField(max_length=150)


class EmployeeType(models.Model):
    name = models.CharField(max_length=150)


class WagePer(models.Model):
    name = models.CharField(max_length=150)


class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(
        max_length=30, null=True, default="", blank=True)
    middle_name = models.CharField(
        max_length=30, null=True, default="", blank=True)
    birth_date = models.DateField(null=True, default=None, blank=True)
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
    department = models.ForeignKey(
        "Department", on_delete=models.PROTECT, null=True, default=None, blank=True)
    job = models.ForeignKey("Job", on_delete=models.PROTECT,
                            null=True, default=None, blank=True)
    status = models.ForeignKey(
        "EmploymentStatus", on_delete=models.PROTECT, null=True, default=None, blank=True)
    type = models.ForeignKey(
        "EmployeeType", on_delete=models.PROTECT, null=True, default=None, blank=True)
    wage = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, default=0.00, blank=True)
    wage_per = models.ForeignKey(
        "WagePer", on_delete=models.PROTECT, null=True, default=None, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f'Employee {self.person.first_name} {self.person.last_name} {self.date_from} {self.date_to}'


class PaymentType(models.Model):
    name = models.CharField(max_length=150)
    class_name = models.CharField(max_length=150)
    group = models.CharField(max_length=150)
    method = models.CharField(max_length=150)


class Payroll(models.Model):
    employee = models.ForeignKey("Employee", on_delete=models.CASCADE)
    pay_period = models.DateField()
    days = models.IntegerField(null=True, default=0, blank=True)
    hours = models.DecimalField(
        max_digits=4, decimal_places=2, null=True, default=0.00, blank=True)
    wage = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, default=0.00, blank=True)
    bonus = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, default=0.00, blank=True)
    taxes = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, default=0.00, blank=True)
    deductions = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, default=0.00, blank=True)
    payments = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, default=0.00, blank=True)
    created = models.DateTimeField(auto_now_add=True)


class PayrollDetails(models.Model):
    employee = models.ForeignKey("Employee", on_delete=models.CASCADE)
    pay_period = models.DateField()
    date_from = models.DateField()
    date_to = models.DateField()
    payment_type = models.ForeignKey("PaymentType", on_delete=models.PROTECT)
    days = models.IntegerField(null=True, default=0, blank=True)
    hours = models.DecimalField(
        max_digits=4, decimal_places=2, null=True, default=0.00, blank=True)
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, default=0.00, blank=True)
    created = models.DateTimeField(auto_now_add=True)
