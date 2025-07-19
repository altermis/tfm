from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView, PredictView, HistoryView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('predict/', PredictView.as_view(), name='predict'),
    path('history/', HistoryView.as_view(), name='history'),
    
]