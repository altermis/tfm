from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Prediction
from .serializers import PredictionSerializer, UserSerializer
from .prediction import predict_image

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists."}, status=400)

        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=201)

class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        image = request.FILES.get('image')
        if not image:
            return Response({"error": "Image is required."}, status=400)

        try:
            result = predict_image(image)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

        prediction = Prediction.objects.create(user=request.user, image=image, result=result)
        serializer = PredictionSerializer(prediction)
        return Response(serializer.data)

class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        predictions = Prediction.objects.filter(user=request.user).order_by('-created_at')
        serializer = PredictionSerializer(predictions, many=True)
        return Response(serializer.data)
