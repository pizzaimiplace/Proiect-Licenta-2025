from django.db import models
from django.core.exceptions import ValidationError

class Course(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.title

class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=50)

    def __str__(self):
        return f"Lesson for {self.course.title}"


class Screen(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='screens', null=True, blank=True, on_delete=models.SET_NULL)
    text = models.TextField()
    play_piano = models.BooleanField(default=False)

    def __str__(self):
        return f"Screen for {self.lesson.title}"


class Task(models.Model):
    screen = models.OneToOneField(Screen, related_name='task', on_delete=models.CASCADE)
    notes = models.JSONField()
    color = models.CharField(max_length=50)

    def __str__(self):
        return f"Task for {self.screen}"


class Condition(models.Model):
    task = models.OneToOneField(Task, related_name='condition', on_delete=models.CASCADE)

    ordered = models.BooleanField(default=True)
    consecutive = models.BooleanField(default=False)
    allow_mistakes = models.BooleanField(default=True)
    chord = models.BooleanField(default=False)

    def clean(self):
        if self.chord and self.ordered:
            raise ValidationError("Chord and ordered both are True")

    def __str__(self):
        return f"Condition for {self.task}"
