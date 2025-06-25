from django.urls import path
from rest_framework.urls import urlpatterns

from . import views

urlpatterns = [
    path('progress/courses/', views.CourseProgressList.as_view(), name='course-progress'),
    path('progress/lessons/', views.LessonProgressList.as_view(), name='lesson-progress'),
]
