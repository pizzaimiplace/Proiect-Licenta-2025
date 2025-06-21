from rest_framework import serializers

from .models import Quiz, Screen

class ScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screen
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    screens = ScreenSerializer(many=True, required=False)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'screens']
