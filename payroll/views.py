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
from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny, IsAdminUser, SAFE_METHODS
from rest_framework.response import Response

from .models import User, Law, Accounting, Company, Person, Employee, Department, Job
from .serializers import UserSerializer, GroupSerializer, LawSerializer, AccountingSerializer, \
    CompanySerializer, PersonSerializer, EmployeeSerializer, DepartmentSerializer, JobSerializer


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


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
    # permission_classes = (IsAuthenticated | ReadOnly)
    # authentication_classes = (TokenAuthentication, )
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        email = self.request.query_params.get('email')
        if email:
            res = User.objects.filter(email=email, is_active=True).first()
            return [res] if res else []
        return User.objects.all()


class GroupView(viewsets.ModelViewSet):
    # permission_classes = (ReadOnly)
    serializer_class = GroupSerializer
    queryset = Group.objects.all()


class LawView(viewsets.ModelViewSet):
    # permission_classes = (ReadOnly)
    serializer_class = LawSerializer
    queryset = Law.objects.all()


class AccountingView(viewsets.ModelViewSet):
    # permission_classes = (ReadOnly)
    serializer_class = AccountingSerializer
    queryset = Accounting.objects.all()


class CompanyView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = CompanySerializer
    queryset = Company.objects.all()

    def create(self, request, *args, **kwargs):
        today = datetime.now()
        companiesCount = Company.objects \
            .filter(owner_id=request.user.id) \
            .filter(deleted__gt=today) \
            .filter(date_from__lte=today) \
            .filter(date_to__gte=today) \
            .filter(is_demo=False) \
            .count()
        if (companiesCount >= 2):
            # The user has 2 companies. For more, you can upgrade your plan to Premium.
            return Response(status=status.HTTP_409_CONFLICT)
        request.data['owner'] = request.user.id
        return super().create(request, *args, **kwargs)


class PersonView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = PersonSerializer
    queryset = Person.objects.all()


class EmployeeView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()

    def get_queryset(self):
        company = self.request.query_params.get('company')
        if company:
            return Employee.objects.filter(company_id=company)
        return Employee.objects.all()


class DepartmentView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()

    def get_queryset(self):
        company = self.request.query_params.get('company')
        if company:
            return Department.objects.filter(company_id=company).order_by('name')
        return Department.objects.all().order_by('name')


class JobView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = JobSerializer
    queryset = Group.objects.all()

    def get_queryset(self):
        user = self.request.query_params.get('user')
        if user:
            return Job.objects.filter(user_id=user).order_by('name')
        return Job.objects.all().order_by('name')
