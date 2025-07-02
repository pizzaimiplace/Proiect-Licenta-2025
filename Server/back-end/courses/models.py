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
    lesson = models.ForeignKey(Lesson, related_name='screens', null=True, blank=True, on_delete=models.CASCADE)
    text = models.TextField()
    play_piano = models.BooleanField(default=False)

    notes = models.JSONField(null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True)

    ordered = models.BooleanField(null=True, blank=True)
    consecutive = models.BooleanField(null=True, blank=True)
    allow_mistakes = models.BooleanField(null=True, blank=True)
    chord = models.BooleanField(null=True, blank=True)

    def clean(self):
        if self.play_piano:
            if not self.notes or not self.color:
                raise ValidationError("play_piano == True, notes and color are null/blank")

            if self.ordered is None or self.consecutive is None or self.allow_mistakes is None or self.chord is None:
                raise ValidationError("play_piano == True, conditions are null/blank")

            if self.chord and self.ordered:
                raise ValidationError("Chord and ordered are both True")
        else:
            if self.notes or self.color or any([
                self.ordered is not None,
                self.consecutive is not None,
                self.allow_mistakes is not None,
                self.chord is not None
            ]):
                raise ValidationError("play_piano == False, task and condition are not null/blank")

    def __str__(self):
        return f"Screen for {self.lesson.title}"
