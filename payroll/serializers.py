from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import User, Law, Accounting, Company, Person, Employee


class UserSerializer(serializers.ModelSerializer):
    is_employer = serializers.SerializerMethodField('get_is_employer')
    is_employee = serializers.SerializerMethodField('get_is_employee')
    companies = serializers.SerializerMethodField('get_companies')

    def get_is_employer(self, obj):
        return obj.groups.filter(id=1).exists()

    def get_is_employee(self, obj):
        return obj.groups.filter(id=2).exists()

    def get_companies(self, obj):
        return list(map(lambda x: {"id": x.id, "name": x.name}, list(Company.objects.filter(owner_id=obj.id).all())))

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'is_active', 'is_staff', 'is_superuser',
                  'is_employer', 'is_employee',
                  'companies',
                  'groups']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class LawSerializer(serializers.ModelSerializer):
    class Meta:
        model = Law
        fields = '__all__'

class AccountingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounting
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    tax_id = serializers.CharField(allow_blank=True)
    class Meta:
        model = Company
        fields = '__all__'

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
