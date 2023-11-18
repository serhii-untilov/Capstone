from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import Group
from rest_framework import status
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import User, Company
from .serializers import UserSerializer, CompanySerializer, GroupSerializer


@api_view(['GET', 'POST'])
def register(request):

    if request.method == 'GET':
        return (Response(status=status.HTTP_200_OK))

    elif request.method == 'POST':
        if not 'group_id' in request.data:
            return None
        if not request.data['group_id']:
            return None
        group = Group.objects.get(id=request.data['group_id'])
        if not group:
            return None
        if not 'username' in request.data:
            request.data['username'] = request.data['email']
        user = User.objects.create_user(username=request.data['username'],
                                        email=request.data['email'],
                                        password=request.data['password'])
        if not user:
            return None
        user.groups.add(group)
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })

    else:
        return (Response(status=status.HTTP_400_BAD_REQUEST))


@api_view(['GET', 'POST'])
def login(request):

    if request.method == 'GET':
        return (Response(status=status.HTTP_200_OK))

    elif request.method == 'POST':
        if not 'username' in request.data:
            request.data['username'] = request.data['email']
        user = User.objects.filter(username=request.data['username']).get()
        if not user:
            return None
        if not check_password(request.data['password'], user.password):
            return None
        refresh = RefreshToken.for_user(user)
        return Response(data={
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_200_OK)

    else:
        return (Response(status=status.HTTP_400_BAD_REQUEST))


@api_view(['GET', 'POST'])
def logout(request):

    if request.method == 'GET':
        return (Response(status=status.HTTP_200_OK))

    elif request.method == 'POST':
        if not 'token' in request.data:
            return (Response(status=status.HTTP_400_BAD_REQUEST))
        token = RefreshToken(request.data['token'])
        token.blacklist()
        return Response(status=status.HTTP_200_OK)

    else:
        return (Response(status=status.HTTP_400_BAD_REQUEST))


class UserView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserSerializer
    queryset = User.objects.all()


class GroupView(viewsets.ModelViewSet):
    # permission_classes = (AllowAny, )
    serializer_class = GroupSerializer
    queryset = Group.objects.all()


class CompanyView(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    queryset = Company.objects.all()
