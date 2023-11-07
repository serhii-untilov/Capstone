from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Company


class CompanyAdmin(admin.ModelAdmin):
    # add the fields of the model here
    list_display = ("name",)


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Company, CompanyAdmin)
