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

    def create(self, validated_data):
        screens_data = validated_data.pop('screens', [])
        quiz = Quiz.objects.create(**validated_data)
        for screen_data in screens_data:
            Screen.objects.create(quiz=quiz, **screen_data)
        return quiz
