#!/bin/sh
set -e

if [ "$DJANGO_DEBUG" = "True" ]; then
    exec python manage.py runserver 0.0.0.0:8000
else
    python manage.py collectstatic --noinput
    exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
fi
