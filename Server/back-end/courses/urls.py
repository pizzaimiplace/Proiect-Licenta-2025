from django.urls import path
from rest_framework.urls import urlpatterns

from . import views

urlpatterns = [
    path('', views.CourseMixinView.as_view(), name='course-create'),
    path('<int:id>/', views.CourseMixinView.as_view(), name='course-detail'),
    path('<int:id>/update/', views.CourseUpdateAPIView.as_view(), name='course-update'),
    path('<int:id>/delete/', views.CourseDestroyAPIView.as_view(), name='course-destroy'),
]