from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django import forms
from .forms import RegistrationForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializer import ProfileSerializer

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

def login_view(request):
    form = LoginForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = authenticate(
            request,
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password']
        )
        if user:
            login(request, user)
            return redirect('home')  # Or any protected view
        else:
            form.add_error(None, 'Invalid credentials')
    return render(request, 'login.html', {'form': form})

# Example protected view:
def home_view(request):
    return render(request, 'home.html')  # Or use HttpResponse if you don't have a template


def register_view(request):
    form = RegistrationForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save(commit=False)
        user.set_password(form.cleaned_data['password'])
        user.save()
        login(request, user)
        return redirect('home')
    return render(request, 'register.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

@api_view(['GET'])
def get_profile(request):
    return Response(ProfileSerializer({'name': "cata", "password": "abcdefg", "email": "catalind333@gmail.com"}).data)