from datetime import datetime
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import Group
from django.db.models import FilteredRelation, Q
from payroll.lib.run_payroll import run_payroll_company
from rest_framework import status
from rest_framework import viewsets
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authentication import TokenAuthentication, BaseAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny, IsAdminUser, SAFE_METHODS
from rest_framework.response import Response
from payroll.lib.date_utils import month_end

from .models import User, Law, Accounting, Company, Person, Employee, Department, Job, \
    EmploymentStatus, EmployeeType, WagePer, \
    PaymentType, Payroll, PayrollDetails
from .serializers import UserSerializer, GroupSerializer, LawSerializer, AccountingSerializer, \
    CompanySerializer, PersonSerializer, EmployeeSerializer, DepartmentSerializer, JobSerializer, \
    EmploymentStatusSerializer, EmployeeTypeSerializer, WagePerSerializer, \
    PaymentTypeSerializer, PayrollSerializer, PayrollDetailsSerializer


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


@api_view(['POST', 'OPTIONS'])
def register(request):
    if request.method == 'POST':
        if not 'group_id' in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data='User role not defined.')
        if not request.data['group_id']:
            return Response(status=status.HTTP_400_BAD_REQUEST, data='User role not defined.')
        group = Group.objects.get(id=request.data['group_id'])
        if not group:
            return Response(status=status.HTTP_400_BAD_REQUEST, data="User role is not defined.")
        if not 'username' in request.data:
            request.data['username'] = request.data['email']
        if User.objects.filter(email=request.data['email']).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST, data="User already exists. Use login instead.")
        user = User.objects.create_user(username=request.data['username'],
                                        email=request.data['email'],
                                        password=request.data['password'])
        if not user:
            return Response(status=status.HTTP_400_BAD_REQUEST, data='User not created.')
        user.groups.add(group)
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


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

    def get_queryset(self):
        user = UserSerializer(self.request.user).data
        if not user:
            return Response(status=status.HTTP_400_BAD_REQUEST, data='User not defined.')
        if user['is_employer']:
            return Company.objects.filter(owner_id=user['id'])
        if user['is_employee']:
            company_ids = [x['company_id'] for x in Employee.objects.filter(person__email=user['email']).values('company_id').distinct()]
            return Company.objects.filter(id__in=company_ids)
        return Response(status=status.HTTP_400_BAD_REQUEST, data='User role not defined.')


class PersonView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = PersonSerializer
    queryset = Person.objects.all()


class EmployeeView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()

    def get_queryset(self):
        company_id = self.request.query_params.get('company')
        user_id = self.request.query_params.get('user')
        if user_id:
            user = User.objects.get(pk=user_id)
            company = Company.objects.get(pk=company_id)
            employee = Employee.objects.filter(
                company_id=company_id,
                person__email=user.email,
                date_from__lte=month_end(company.pay_period),
                date_to__gte=company.pay_period,
            ).first()
            if employee:
                return [employee]
            employee = Employee.objects.filter(
                company_id=company_id,
                person__email=user.email,
                date_from__lte=month_end(company.pay_period),
            ).first()
            if employee:
                return [employee]
            employee = Employee.objects.filter(
                company_id=company_id,
                person__email=user.email,
            ).first()
            if employee:
                return [employee]
            return Response(status=status.HTTP_404_NOT_FOUND, data='Employee not found.')
        if company_id:
            return Employee.objects.filter(company_id=company_id)
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


class EmploymentStatusView(viewsets.ModelViewSet):
    # permission_classes = (ReadOnly)
    serializer_class = EmploymentStatusSerializer
    queryset = EmploymentStatus.objects.all()


class EmployeeTypeView(viewsets.ModelViewSet):
    # permission_classes = (ReadOnly)
    serializer_class = EmployeeTypeSerializer
    queryset = EmployeeType.objects.all()


class WagePerView(viewsets.ModelViewSet):
    # permission_classes = (ReadOnly)
    serializer_class = WagePerSerializer
    queryset = WagePer.objects.all()


class PaymentTypeView(viewsets.ModelViewSet):
    # permission_classes = (ReadOnly)
    serializer_class = PaymentTypeSerializer
    queryset = PaymentType.objects.all()


class PayrollView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = PayrollSerializer
    queryset = Payroll.objects.all()

    def get_queryset(self):
        employee = self.request.query_params.get('employee')
        company = self.request.query_params.get('company')
        pay_period = self.request.query_params.get('period')
        if company:
            run_payroll_company(company, pay_period)
            return Payroll.objects.filter(employee__company_id=company, pay_period=pay_period).order_by('employee_id')
        if employee:
            return Payroll.objects.filter(employee_id=employee).order_by('pay_period')
        return Payroll.objects.all()


class PayrollDetailsView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = PayrollDetailsSerializer
    queryset = PayrollDetails.objects.all()

    def get_queryset(self):
        employee = self.request.query_params.get('employee')
        pay_period = self.request.query_params.get('period')
        if employee:
            return PayrollDetails.objects.filter(employee_id=employee, pay_period=pay_period).order_by('payment_type_id')
        return PayrollDetails.objects.all()
