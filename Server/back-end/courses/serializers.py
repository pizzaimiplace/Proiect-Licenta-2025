from rest_framework import serializers

from .models import Course, Lesson, Screen

class ScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screen
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    screens = ScreenSerializer(many=True, required=False)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'screens']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, required=False)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'lessons']
