from django.urls import path
from rest_framework.urls import urlpatterns

from . import views

urlpatterns = [
    path('', views.QuizMixinView.as_view(), name='quiz-create'),
    path('<int:quiz_id>/', views.QuizMixinView.as_view(), name='quiz-detail'),
    path('<int:quiz_id>/update/', views.QuizMixinView.as_view(), name='quiz-update'),
    path('<int:quiz_id>/delete/', views.QuizMixinView.as_view(), name='quiz-destroy'),

    path('<int:quiz_id>/screens/', views.ScreenMixinView.as_view(), name='screen-create'),
    path('<int:quiz_id>/screens/<int:screen_id>/', views.ScreenMixinView.as_view(), name='screen-detail'),
    path('<int:quiz_id>/screens/<int:screen_id>/update/', views.ScreenMixinView.as_view(), name='screen-update'),
    path('<int:quiz_id>/screens/<int:screen_id>/delete/', views.ScreenMixinView.as_view(), name='screen-destroy'),
]