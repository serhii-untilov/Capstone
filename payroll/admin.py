from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Company, Person, Employee, Department, Job


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

class PersonAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("first_name", "last_name", "middle_name",
                    "date_from", "date_to", "tax_id", "email", "user")


class EmployeeAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("company", "person", "date_from", "date_to")


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(Person, PersonAdmin)
admin.site.register(Employee, EmployeeAdmin)
