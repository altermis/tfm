
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Prediction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ['id', 'image', 'result', 'created_at']
