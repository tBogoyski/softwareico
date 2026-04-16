# Build the React frontend for production
FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY frontend/package.json ./
RUN npm install

COPY frontend/ .

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Minimal output stage with just the dist files
FROM scratch AS frontend-dist
COPY --from=frontend-build /app/dist /dist
