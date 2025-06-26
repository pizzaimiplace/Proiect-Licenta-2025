from django.urls import path
from rest_framework.urls import urlpatterns


from . import views

urlpatterns = [
    path('', views.CourseMixinView.as_view(), name='course-create'),
    path('<int:id>/', views.CourseMixinView.as_view(), name='course-detail'),
    path('<int:id>/update/', views.CourseMixinView.as_view(), name='course-update'),
    path('<int:id>/delete/', views.CourseMixinView.as_view(), name='course-destroy'),

    path('<int:course_id>/lessons/', views.LessonMixinView.as_view(), name='lesson-create'),
    path('<int:course_id>/lessons/<int:lesson_id>/', views.LessonMixinView.as_view(), name='lesson-detail'),
    path('<int:course_id>/lessons/<int:lesson_id>/update/', views.LessonMixinView.as_view(), name='lesson-update'),
    path('<int:course_id>/lessons/<int:lesson_id>/delete/', views.LessonMixinView.as_view(), name='lesson-destroy'),
    path('<int:course_id>/lessons/<int:lesson_id>/complete/', views.complete_lesson_view, name='lesson-complete'),

    path('<int:course_id>/lessons/<int:lesson_id>/screens/', views.ScreenMixinView.as_view(), name='screen-create'),
    path('<int:course_id>/lessons/<int:lesson_id>/screens/<int:screen_id>/', views.ScreenMixinView.as_view(), name='screen-detail'),
    path('<int:course_id>/lessons/<int:lesson_id>/screens/<int:screen_id>/update/', views.ScreenMixinView.as_view(), name='screen-update'),
    path('<int:course_id>/lessons/<int:lesson_id>/screens/<int:screen_id>/delete/', views.ScreenMixinView.as_view(), name='screen-destroy'),
]