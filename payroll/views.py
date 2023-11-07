from django.shortcuts import render
from django.contrib.auth.models import Group
from rest_framework import viewsets
from .serializers import UserSerializer, CompanySerializer, GroupSerializer
from .models import User, Company

class UserView(viewsets.ModelViewSet):
	serializer_class = UserSerializer
	queryset = User.objects.all()

class GroupView(viewsets.ModelViewSet):
	serializer_class = GroupSerializer
	queryset = Group.objects.all()

class CompanyView(viewsets.ModelViewSet):
	serializer_class = CompanySerializer
	queryset = Company.objects.all()



