from .models import Course
from django.contrib.auth.models import User
from profiles.models import CourseProgress, LessonProgress

def complete_lesson(user: User, lesson):
    lesson_progress, _ = LessonProgress.objects.get_or_create(user=user, lesson=lesson)
    if not lesson_progress.completed:
        lesson_progress.completed = True
        lesson_progress.save()

    course = lesson.course
    all_lessons = course.lessons.all()

    completed_lessons = LessonProgress.objects.filter(
        user=user,
        lesson__in=all_lessons,
        completed=True
    ).count()

    if completed_lessons == all_lessons.count():
        course_progress, _ = CourseProgress.objects.get_or_create(user=user, course=course)
        if not course_progress.completed:
            course_progress.completed = True
            course_progress.save()
        return True

    return False
