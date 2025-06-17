from django.db import models

# Create your models here.
class Profile(models.Model):
    name = models.CharField(max_length=30)
    password = models.TextField()
    email = models.TextField(default='No email')

    def __str__(self):
        return self.name