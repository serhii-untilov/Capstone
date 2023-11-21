from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import User, Company


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


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
