from django.contrib.auth.models import Group
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Company
from .serializers import UserSerializer, CompanySerializer, GroupSerializer


class UserView(viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated, )
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request):
        if not 'group_id' in request.data:
            return None
        if not request.data['group_id']:
            return None
        group = Group.objects.get(id=request.data['group_id'])
        if not group:
            return None
        user = User.objects.create_user(username=request.data['username'],
                                        email=request.data['email'],
                                        password=request.data['password'])
        if not user:
            return None
        user.groups.add(group)
        user.save()
        refresh = RefreshToken.for_user(user)
        return {'refresh': str(refresh),
                'access': str(refresh.access_token)
                }


class GroupView(viewsets.ModelViewSet):
    # permission_classes = (AllowAny, )
    serializer_class = GroupSerializer
    queryset = Group.objects.all()


class CompanyView(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    queryset = Company.objects.all()
