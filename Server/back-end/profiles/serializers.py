from rest_framework import serializers
from .models import LessonProgress, CourseProgress

class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title')

    class Meta:
        model = LessonProgress
        fields = ['lesson', 'lesson_title', 'completed']


class CourseProgressSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title')

    class Meta:
        model = CourseProgress
        fields = ['course', 'course_title', 'completed']
