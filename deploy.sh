#!/bin/sh
set -e

cd /srv/apps/softwareico

echo "Pulling latest changes..."
git pull

echo "Building frontend..."
docker build -f nginx/Dockerfile --target frontend-build -t softwareico-frontend .
docker create --name temp-frontend softwareico-frontend
docker cp temp-frontend:/app/dist/. ./frontend/dist/
docker rm temp-frontend

echo "Starting backend services..."
docker compose up -d --build db redis backend

echo "Running migrations..."
docker compose exec backend python manage.py migrate

echo "Deploy complete!"
