from django.db import models
from django.contrib.auth.models import User

class Prediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='predictions/')
    result = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
