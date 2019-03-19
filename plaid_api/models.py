from django.contrib.auth.models import User
from django.db import models

class Item(models.Model):
    access_token = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} - {self.access_token[:8]}"
