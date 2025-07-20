# # # from django.test import TestCase

# # # # Create your tests here.
# # # from django.urls import reverse
# # # from rest_framework.test import APITestCase
# # # from rest_framework import status
# # # from django.contrib.auth.models import User
# # # from rest_framework_simplejwt.tokens import RefreshToken
# # # from django.core.files.uploadedfile import SimpleUploadedFile
# # # import io
# # # from PIL import Image

# # # class PredictionAPITests(APITestCase):

# # #     def setUp(self):
# # #         self.user = User.objects.create_user(username="testuser", password="testpass")
# # #         login_response = self.client.post(reverse('token_obtain_pair'), {
# # #             'username': 'testuser',
# # #             'password': 'testpass'
# # #         })
# # #         self.token = login_response.data['access']
# # #         self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

# # #     def generate_test_image(self):
# # #         img = Image.new("RGB", (224, 224), color=(73, 109, 137))
# # #         buffer = io.BytesIO()
# # #         img.save(buffer, format="JPEG")
# # #         buffer.seek(0)
# # #         return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")

# # #     def test_register(self):
# # #         url = reverse('register')  # Si tens un endpoint /api/register/
# # #         data = {'username': 'newuser', 'password': 'newpass'}
# # #         response = self.client.post(url, data)
# # #         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

# # #     def test_login(self):
# # #         url = reverse('token_obtain_pair')  # endpoint per obtenir el token JWT
# # #         data = {'username': 'testuser', 'password': 'testpass'}
# # #         response = self.client.post(url, data)
# # #         self.assertEqual(response.status_code, status.HTTP_200_OK)
# # #         self.assertIn("access", response.data)

# # #     def test_prediction(self):
# # #         url = reverse('predict')
# # #         image = self.generate_test_image()
# # #         self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
# # #         response = self.client.post(url, {'image': image})
# # #         self.assertEqual(response.status_code, status.HTTP_200_OK)
# # #         self.assertIn("result", response.data)

# # #     def test_history(self):
# # #         url = reverse('history')
# # #         self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
# # #         response = self.client.get(url)
# # #         self.assertEqual(response.status_code, status.HTTP_200_OK)

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from PIL import Image

from .models import Prediction
class PredictionAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        login_response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpass'
        })
        self.token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def generate_test_image(self, size=(224, 224), color=(73, 109, 137), format="JPEG"):
        img = Image.new("RGB", size, color=color)
        buffer = io.BytesIO()
        img.save(buffer, format=format)
        buffer.seek(0)
        return SimpleUploadedFile("test.jpg", buffer.read(), content_type="image/jpeg")

    def generate_large_test_image(self):
        img = Image.effect_noise((4000, 4000), 100)  # añade "ruido" para que pese más
        buffer = io.BytesIO()
        img = img.convert("RGB")
        img.save(buffer, format="JPEG", quality=100)  # menos compresión
        buffer.seek(0)
        return SimpleUploadedFile("large.jpg", buffer.read(), content_type="image/jpeg")

    # --- Registro ---

    def test_register_success(self):
        self.client.credentials()  # Sin token para registrar
        url = reverse('register')
        data = {'username': 'newuser', 'password': 'newpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_existing_user(self):
        self.client.credentials()
        url = reverse('register')
        data = {'username': 'testuser', 'password': 'anypass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_fields(self):
        self.client.credentials()
        url = reverse('register')
        response = self.client.post(url, {'username': ''})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Login ---

    def test_login_success(self):
        url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'testpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    # --- Predicción ---

    def test_prediction_success(self):
        url = reverse('predict')
        image = self.generate_test_image()
        response = self.client.post(url, {'image': image})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("result", response.data)

    def test_prediction_large_image(self):
        url = reverse('predict')
        large_image = self.generate_large_test_image()  
        response = self.client.post(url, {'image': large_image})
        self.assertEqual(response.status_code, status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)

    def test_prediction_invalid_format(self):
        url = reverse('predict')
        fake_file = SimpleUploadedFile("test.txt", b"not an image", content_type="text/plain")
        response = self.client.post(url, {'image': fake_file})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid image format", str(response.data))

    def test_prediction_no_image(self):
        url = reverse('predict')
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Historial ---
    def test_history_success_pagination(self):
            url = reverse('history')
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            data = response.json()

            self.assertIn('results', data)
            self.assertIn('next', data)
            self.assertIn('previous', data)
            self.assertIn('count', data)
            self.assertLessEqual(len(data['results']), 10)
    
    def test_history_second_page(self):
        for _ in range(15):  
            Prediction.objects.create(
                user=self.user,
                image=SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg"),
                result="Healthy"
            )

        url = reverse('history') + '?page=2'
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    # --- Acceso ---

    def test_access_without_token(self):
        self.client.credentials()  
        url = reverse('predict')
        image = self.generate_test_image()
        response = self.client.post(url, {'image': image})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_with_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer faketoken123')
        url = reverse('predict')
        image = self.generate_test_image()
        response = self.client.post(url, {'image': image})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
