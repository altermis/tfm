from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from .models import Prediction
import json
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PredictionSerializer(serializers.ModelSerializer):
    result = serializers.SerializerMethodField()

    class Meta:
        model = Prediction
        fields = ['id', 'image', 'result', 'created_at']

    def get_result(self, obj):
        if isinstance(obj.result, dict):
            return obj.result
        if isinstance(obj.result, str):
            try:
                return json.loads(obj.result.replace("'", '"'))
            except Exception:
                return None
        return None
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            return super().validate(attrs)
        except AuthenticationFailed:
            raise AuthenticationFailed({"error": "No s'ha trobat cap compte actiu amb aquestes credencials."})

