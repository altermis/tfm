import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.core.exceptions import RequestDataTooBig
from .models import Prediction
from .serializers import PredictionSerializer, UserSerializer
from .prediction import predict_image
from django.core.files.images import get_image_dimensions
import imghdr

from rest_framework import generics

from rest_framework.pagination import PageNumberPagination

logger = logging.getLogger('app')

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            logger.warning("Intent de registre sense usuari o contrasenya")
            return Response({"error": "Username and password are required."}, status=400)

        if User.objects.filter(username=username).exists():
            logger.warning(f"Usuari ja existent: {username}")
            return Response({"error": "User already exists."}, status=400)

        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        logger.info(f"Nou registre: {username}")
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=201)

class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            image = request.FILES.get('image')
            if not image:
                return Response({"error": "Image is required."}, status=400)

            MAX_IMAGE_SIZE = 5 * 1024 * 1024  
            if image.size > MAX_IMAGE_SIZE:
                return Response({"error": "Image too large (max 5MB)."}, status=413)

            valid_types = ['jpeg', 'png']
            if imghdr.what(image) not in valid_types:
                return Response({"error": "Invalid image format."}, status=400)

            result = predict_image(image)

            prediction = Prediction.objects.create(
                user=request.user,
                image=image,
                result=result
            )
            logger.info(f"Predicció realitzada per {request.user.username}: {result}")
            serializer = PredictionSerializer(prediction)
            return Response(serializer.data)

        except RequestDataTooBig:
            logger.warning(f"Fitxer massa gran enviat per {request.user.username}")
            return Response({"error": "Image too large."}, status=413)
        except Exception as e:
            logger.error(f"Error en la predicció: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=500)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  
    page_size_query_param = 'page_size'
    max_page_size = 50
class HistoryView(generics.ListAPIView):
    serializer_class = PredictionSerializer

    def get_queryset(self):
        return Prediction.objects.filter(user=self.request.user).order_by('-created_at')
