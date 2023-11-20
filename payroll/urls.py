from django.urls import path, include
from payroll import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', views.UserView, 'user')
router.register(r'groups', views.GroupView, 'group')
router.register(r'companies', views.CompanyView, 'company')

urlpatterns = [
	path('api/', include(router.urls)),
    path('api/register/', views.register),
    # path('api/login/', views.login),
    path('api/logout/', views.logout),
    path('api/change_password/', views.changePassword),
    path('api/update_profile/', views.updateProfile),
]
