from django.urls import path, include
from payroll import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', views.UserView, 'user')
router.register(r'groups', views.GroupView, 'group')
router.register(r'laws', views.LawView, 'law')
router.register(r'accounting', views.AccountingView, 'accounting')
router.register(r'companies', views.CompanyView, 'company')
router.register(r'persons', views.PersonView, 'person')
router.register(r'employees', views.EmployeeView, 'employee')
router.register(r'departments', views.DepartmentView, 'department')
router.register(r'jobs', views.JobView, 'job')
router.register(r'employment-statuses', views.EmploymentStatusView, 'employment-status')
router.register(r'employee-types', views.EmployeeTypeView, 'employee-type')
router.register(r'wage-per-list', views.WagePerView, 'wage-per')
router.register(r'payment-types', views.PaymentTypeView, 'payment-type')
router.register(r'payroll', views.PayrollView, 'payroll')
router.register(r'payroll-details', views.PayrollDetailsView, 'payroll-details')

urlpatterns = [
	path('api/', include(router.urls)),
    path('api/register/', views.register),
    path('api/logout/', views.logout),
    path('api/change_password/', views.changePassword),
    path('api/update_profile/', views.updateProfile),
    path('api/current_user/', views.currentUser),
]
