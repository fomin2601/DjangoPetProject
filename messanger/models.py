from django.contrib.auth.models import User
from django.db import models


class Message(models.Model):
    username = models.CharField(max_length=255)
    room = models.CharField(max_length=255)
    content = models.TextField()
    is_important = models.BooleanField(default=False)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)


class Room(models.Model):
    room = models.CharField(max_length=255)
    host_user = models.ForeignKey(User, on_delete=models.CASCADE)
    allowed_users = models.CharField(max_length=255)

    def allowed_users_as_list(self):
        return self.allowed_users.split('|')

