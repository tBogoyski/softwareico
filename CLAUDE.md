# CLAUDE.md - SoftwareICO Project Guide

## What Is This Project

SaaS product directory. Users browse and discover software products for their business needs. All public pages are accessible without authentication. Data is managed through Django Admin.

## Tech Stack

- **Backend:** Django 5 + Django REST Framework, PostgreSQL 16, Redis 7, django-modeltranslation
- **Frontend:** React 18 + Vite, Tailwind CSS, Framer Motion, React Router
- **Infrastructure:** Docker Compose (all services)

## Running The Project

```bash
docker compose up --build        # start everything
docker compose down              # stop everything
docker compose exec backend python manage.py migrate       # run migrations
docker compose exec backend python manage.py createsuperuser  # create admin user
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

## Project Layout

```
backend/              # Django project
  config/             # settings, urls, wsgi
  products/           # main app (models, views, serializers, admin)
frontend/             # React project
  src/pages/          # route-level page components
  src/components/     # reusable UI components (layout/, ui/, product/)
  src/api/            # axios API client
  src/hooks/          # custom React hooks
```

## Code Conventions

### Backend (Django)
- Settings module: `config.settings` (not the default `project.settings`)
- App name: `products` (singular main app, not split into micro-apps)
- Use `slug` fields for URL-friendly identifiers (not IDs in URLs)
- Serializers live in `products/serializers.py`
- Filtering via `django-filter` in `products/filters.py`
- Admin customization in `products/admin.py` with inlines for related models
- Translations via `django-modeltranslation` registered in `products/translation.py`
- API URLs prefixed with `/api/`
- Media files served from `/media/` in dev

### Frontend (React)
- Pages are in `src/pages/` and named `XxxPage.jsx`
- Reusable components in `src/components/` grouped by domain: `layout/`, `ui/`, `product/`
- API calls go through `src/api/client.js` (axios instance with baseURL)
- Custom hooks in `src/hooks/` prefixed with `use` (e.g., `useProducts`)
- Tailwind for all styling -- no CSS modules, no styled-components
- Framer Motion for animations
- React Router for routing, defined in `App.jsx`

## Database Models

Main models in `products/models.py`:
- **Category** - product categories (e.g., CRM, AI Chatbot, ERP)
- **Tag** - flexible labels (e.g., "transportation", "e-commerce")
- **Product** - the main entity with name, description, pricing, category FK, tags M2M
- **ProductImage** - images for a product (1:N)
- **ProductLink** - external links: website, demo, docs, video (1:N)
- **ProductContact** - contact info: email, phone, social (1:N)

Translatable fields (name, description, tagline, pricing_details) use `django-modeltranslation`, which auto-creates `_en` and `_bg` column variants. Translations are registered in `products/translation.py`.

## API Endpoints

- `GET /api/products/` - list with search, filter, sort, pagination
- `GET /api/products/:slug/` - detail with nested images, links, contacts
- `GET /api/categories/` - all categories
- `GET /api/tags/` - all tags
- `GET /api/stats/` - aggregate counts for the hero page

## Environment Variables

All env vars are in `.env` (copied from `.env-sample`). Key vars:
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` - database credentials
- `DJANGO_SECRET_KEY` - Django secret key
- `DJANGO_DEBUG` - debug mode flag
- `CORS_ALLOWED_ORIGINS` - frontend origin for CORS

## Important Notes

- All public pages (index, list, detail) work without authentication
- Django Admin is the only authenticated interface (staff users)
- No user registration/login in the initial version
- The frontend owner (Tano) is a backend developer -- keep frontend code well-structured and commented where patterns might be unfamiliar
- Docker Compose is the only supported dev environment -- no local Python/Node setup docs needed
