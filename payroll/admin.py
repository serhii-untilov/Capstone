from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Company, Person, Employee


class CompanyAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("name", "laws", "tax_id", "accounting",
                    "owner", "date_from", "date_to", "is_demo")


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
admin.site.register(Person, PersonAdmin)
admin.site.register(Employee, EmployeeAdmin)
