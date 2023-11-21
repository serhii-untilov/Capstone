from datetime import datetime
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import Group
from rest_framework import status
from rest_framework import viewsets
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authentication import TokenAuthentication, BaseAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import User, Company
from .serializers import UserSerializer, CompanySerializer, GroupSerializer


@api_view(['POST', 'OPTIONS'])
def register(request):
    if request.method == 'POST':
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


# @api_view(['POST', 'OPTIONS'])
# def login(request):
#     if request.method == 'POST':
#         if not 'username' in request.data:
#             request.data['username'] = request.data['email']
#         user = User.objects.filter(username=request.data['username']).get()
#         if not user:
#             return None
#         if not check_password(request.data['password'], user.password):
#             return None
#         refresh = RefreshToken.for_user(user)
#         return Response(data={
#             'refresh': str(refresh),
#             'access': str(refresh.access_token)
#         }, status=status.HTTP_200_OK)
#     else:
#         return (Response(status=status.HTTP_400_BAD_REQUEST))


@api_view(['POST', 'OPTIONS'])
# @authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method == 'POST':
        if not request.auth:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # refreshToken = RefreshToken(request.data.get('refresh'))
        # accessToken = refreshToken.access_token()
        # refreshToken.blacklist()
        # accessToken.blacklist()
        tokens = OutstandingToken.objects.filter(user_id=request.user.id)
        for token in tokens:
            t, _ = BlacklistedToken.objects.get_or_create(token=token)
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def currentUser(request):
    if request.method == 'POST':
        if not request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = UserSerializer(request.user).data
        return Response(data=user, status=status.HTTP_200_OK)
    else:
        return (Response(status=status.HTTP_400_BAD_REQUEST))


@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def changePassword(request):
    if request.method == 'POST':
        if not request.auth:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        raw_password = request.data.get('password')
        user = request.user
        user.set_password(raw_password)
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response(data={
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def updateProfile(request, id):
    if request.method == 'POST':
        if not request.auth:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        user = request.user
        if request.data.get('username'):
            user.username = request.data.get('username')
        if request.data.get('first_name'):
            user.first_name = request.data.get('first_name')
        if request.data.get('last_name'):
            user.last_name = request.data.get('last_name')
        if request.data.get('email'):
            user.email = request.data.get('email')
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response(data={
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    # authentication_classes = (TokenAuthentication, )
    serializer_class = UserSerializer
    queryset = User.objects.all()


class GroupView(viewsets.ModelViewSet):
    # permission_classes = (AllowAny, )
    serializer_class = GroupSerializer
    queryset = Group.objects.all()


class CompanyView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = CompanySerializer
    queryset = Company.objects.all()
