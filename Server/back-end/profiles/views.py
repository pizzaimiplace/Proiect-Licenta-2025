from rest_framework import generics
from rest_framework import permissions
from .models import CourseProgress, LessonProgress
from .serializers import CourseProgressSerializer, LessonProgressSerializer

class CourseProgressList(generics.ListAPIView):
    serializer_class = CourseProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CourseProgress.objects.filter(user=self.request.user)


class LessonProgressList(generics.ListAPIView):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LessonProgress.objects.filter(user=self.request.user)


def complete_lesson(user, lesson):
    progress, _ = LessonProgress.objects.get_or_create(user=user, lesson=lesson)
    progress.completed = True
    progress.save()

    course = lesson.course
    all_lessons = course.lessons.all()
    user_completed = LessonProgress.objects.filter(user=user, lesson__in=all_lessons, completed=True)

    if user_completed.count() == all_lessons.count():
        CourseProgress.objects.update_or_create(
            user=user, course=course,
            defaults={'completed': True}
        )
