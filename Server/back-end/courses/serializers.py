from rest_framework import serializers

from .models import Course, Lesson, Screen, Task, Condition

class ConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    condition = ConditionSerializer()

    class Meta:
        model = Task
        fields = ['notes', 'colors', 'condition']

class ScreenSerializer(serializers.ModelSerializer):
    task = TaskSerializer()

    class Meta:
        model = Screen
        fields = ['text', 'playpiano', 'task']

class LessonSerializer(serializers.ModelSerializer):
    screens = ScreenSerializer(many=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'screens']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, required=False)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'lessons']
