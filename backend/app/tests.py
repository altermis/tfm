from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from PIL import Image

class PredictionAPITests(APITestCase):
    # def setUp(self):
    #     self.user = User.objects.create_user(username="testuser", password="testpass")
    #     self.token = str(RefreshToken.for_user(self.user).access_token)
    #     self.auth_header = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        login_response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpass'
        })
        self.token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def generate_test_image(self):
        img = Image.new("RGB", (224, 224), color=(73, 109, 137))
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG")
        buffer.seek(0)
        return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")

    def test_register(self):
        url = reverse('register')  # Si tens un endpoint /api/register/
        data = {'username': 'newuser', 'password': 'newpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login(self):
        url = reverse('token_obtain_pair')  # endpoint per obtenir el token JWT
        data = {'username': 'testuser', 'password': 'testpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_prediction(self):
        url = reverse('predict')
        image = self.generate_test_image()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(url, {'image': image})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("result", response.data)

    def test_history(self):
        url = reverse('history')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
