from django.db import models
from django.core.exceptions import ValidationError

class Quiz(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

class Screen(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='screens', null=True, blank=True, on_delete=models.SET_NULL)
    text = models.TextField()

    notes = models.JSONField(null=True, blank=True)

    ordered = models.BooleanField(null=True, blank=True)
    consecutive = models.BooleanField(null=True, blank=True)
    allow_mistakes = models.BooleanField(null=True, blank=True)
    chord = models.BooleanField(null=True, blank=True)

    def clean(self):
        if not self.notes or not self.color:
            raise ValidationError("Notes and color are null/blank")

        if self.ordered is None or self.consecutive is None or self.allow_mistakes is None or self.chord is None:
            raise ValidationError("Conditions are null/blank")

        if self.chord and self.ordered:
            raise ValidationError("Chord and ordered are both True")

    def __str__(self):
        return f"Screen for {self.quiz.title}"
