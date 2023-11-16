from django.contrib import admin
from django.urls import path, include
from payroll import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', views.UserView, 'user')
router.register(r'groups', views.GroupView, 'group')
router.register(r'companies', views.CompanyView, 'company')

urlpatterns = [
	path('api/', include(router.urls)),
    path('api/login/', views.login)
]
