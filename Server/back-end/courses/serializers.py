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

    def create(self, validated_data):
        lessons_data = validated_data.pop('lessons', [])
        course = Course.objects.create(**validated_data)

        for lesson_data in lessons_data:
            screens_data = lesson_data.pop('screens', [])
            lesson = Lesson.objects.create(course=course, **lesson_data)

            for screen_data in screens_data:
                Screen.objects.create(lesson=lesson, **screen_data)

        return course
