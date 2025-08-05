cd backend
docker-compose up --build

docker-compose exec web python manage.py test

cd frontend
npx expo start