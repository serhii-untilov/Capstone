from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Law, Accounting, Company, Person, Employee, \
    Department, Job, PaymentType, EmploymentStatus, EmployeeType, WagePer, \
    Payroll, PayrollDetails


class LawAdmin(admin.ModelAdmin):
    list_display = ('name',)


class AccountingAdmin(admin.ModelAdmin):
    list_display = ('name',)


class CompanyAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("name", "law", "tax_id", "accounting",
                    "owner", "date_from", "date_to", "is_demo")


class DepartmentAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("company", "name")


class JobAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("user", "name")


class EmploymentStatusAdmin(admin.ModelAdmin):
    list_display = ("name",)


class EmployeeTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)


class WagePerAdmin(admin.ModelAdmin):
    list_display = ('name',)


class PersonAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("first_name", "last_name", "middle_name",
                    "birth_date", "tax_id", "email", "user")


class EmployeeAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("company", "person", "date_from", "date_to")


class PaymentTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


class PayrollAdmin(admin.ModelAdmin):
    list_display = ("employee", 'pay_period', 'days', 'hours',
                    'wage', 'bonus', 'taxes', 'deductions', 'payments')

class PayrollDetailsAdmin(admin.ModelAdmin):
    list_display = ("employee", 'pay_period', 'date_from', 'date_to', 'payment_type',
                    'days', 'hours', 'amount')


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Law, LawAdmin)
admin.site.register(Accounting, AccountingAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(EmploymentStatus, EmploymentStatusAdmin)
admin.site.register(EmployeeType, EmployeeTypeAdmin)
admin.site.register(WagePer, WagePerAdmin)
admin.site.register(Person, PersonAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(PaymentType, PaymentTypeAdmin)
admin.site.register(Payroll, PayrollAdmin)
