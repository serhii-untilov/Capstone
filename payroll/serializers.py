from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import User, Law, Accounting, Company, Person, Employee, Department, Job, PaymentType, Payroll, PayrollDetails


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


class EmploymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounting
        fields = '__all__'


class EmployeeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounting
        fields = '__all__'


class WagePerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounting
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    tax_id = serializers.CharField(allow_blank=True)

    class Meta:
        model = Company
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):
    tax_id = serializers.CharField(allow_blank=True)
    last_name = serializers.CharField(allow_blank=True)
    middle_name = serializers.CharField(allow_blank=True)
    email = serializers.CharField(allow_blank=True)

    class Meta:
        model = Person
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField('get_full_name')
    tax_id = serializers.SerializerMethodField('get_tax_id')
    email = serializers.SerializerMethodField('get_email')

    def get_full_name(self, obj):
        return obj.person.first_name + ' ' + obj.person.last_name

    def get_tax_id(self, obj):
        return obj.person.tax_id

    def get_email(self, obj):
        return obj.person.email

    class Meta:
        model = Employee
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class PaymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentType
        fields = ['id', 'name', 'class',  'group', 'method',]


PaymentTypeSerializer._declared_fields["class"] = serializers.CharField(
    source="class_name")


class PayrollSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField('get_full_name')
    tax_id = serializers.SerializerMethodField('get_tax_id')
    email = serializers.SerializerMethodField('get_email')

    def get_full_name(self, obj):
        return obj.employee.person.first_name + ' ' + obj.employee.person.last_name

    def get_tax_id(self, obj):
        return obj.employee.person.tax_id

    def get_email(self, obj):
        return obj.employee.person.email

    class Meta:
        model = Payroll
        fields = '__all__'

class PayrollDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollDetails
        fields = '__all__'
