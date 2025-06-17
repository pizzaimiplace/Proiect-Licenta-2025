from django.urls import path
from .views import login_view, home_view, register_view, logout_view, get_profile

urlpatterns = [
    path('', home_view, name='home'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('profiles/', get_profile, name='get_profile')
]
