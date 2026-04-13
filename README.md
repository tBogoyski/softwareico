# SoftwareICO - SaaS Product Directory for Bulgarian Businesses

A web platform where businesses can discover SaaS products tailored to their industry and problems. Think of it as a curated directory: a transportation company finds their ideal CRM, an OpenCart store owner finds the right AI chatbot integration -- all in one place.

**Target market:** Bulgaria first, then expanding to the rest of the world.

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Backend      | Django 5.x + Django REST Framework  |
| Frontend     | React 18 + Vite + React Router      |
| Database     | PostgreSQL 16                       |
| Cache        | Redis 7 (session cache, API cache)  |
| Translations | django-modeltranslation (en/bg)     |
| Styling      | Tailwind CSS + Framer Motion        |
| Container    | Docker + Docker Compose             |
| Admin        | Django Admin (built-in)             |

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Docker Compose                  │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ React    │  │ Django   │  │ PostgreSQL    │  │
│  │ dev:5173 │──│ api:8000 │──│ db:5432       │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│                     │                            │
│                ┌──────────┐                      │
│                │ Redis    │                      │
│                │ cache:6379│                      │
│                └──────────┘                      │
└─────────────────────────────────────────────────┘
```

## Pages

| Page           | URL                  | Auth     | Description                                                        |
| -------------- | -------------------- | -------- | ------------------------------------------------------------------ |
| Index / Hero   | `/`                  | Public   | Landing page with animated hero, featured listings, stats counters |
| Product List   | `/products`          | Public   | All products with search, sort, filter by category/tags/pricing    |
| Product Detail | `/products/:slug`    | Public   | Full product info: description, media, links, contacts, tags       |
| Django Admin   | `/admin/`            | Staff    | Data management (CRUD for products, categories, tags)              |

## Database Schema

```
┌─────────────────────┐       ┌─────────────────────┐
│ Category            │       │ Tag                  │
│─────────────────────│       │─────────────────────│
│ id (PK)             │       │ id (PK)              │
│ name [T]            │       │ name                 │
│ slug                │       │ slug                 │
│ description [T]     │       └─────────────────────┘
│ icon                │               ▲
│ order               │               │ M2M
└────────┬────────────┘               │
         │ FK                 ┌───────┴─────────────┐
         │                    │ Product              │
         └───────────────────►│─────────────────────│
                              │ id (PK)              │
                              │ category (FK)        │
                              │ name [T]             │
                              │ slug                 │
                              │ tagline [T]          │
                              │ description [T]      │
                              │ logo                 │
                              │ website_url          │
                              │ pricing_type         │
                              │ pricing_details [T]  │
                              │ tags (M2M -> Tag)    │
                              │ is_featured          │
                              │ is_active            │
                              │ created_at           │
                              │ updated_at           │
                              └───────┬─────────────┘
                                      │ FK (1:N)
                              ┌───────┴─────────────┐
                              │ ProductImage         │
                              │─────────────────────│
                              │ id (PK)              │
                              │ product (FK)         │
                              │ image                │
                              │ alt_text             │
                              │ order                │
                              └─────────────────────┘

                              ┌─────────────────────┐
                              │ ProductLink          │
                              │─────────────────────│
                              │ id (PK)              │
                              │ product (FK)         │
                              │ label                │
                              │ url                  │
                              │ link_type            │
                              │ (demo/docs/video/etc)│
                              └─────────────────────┘

                              ┌─────────────────────┐
                              │ ProductContact       │
                              │─────────────────────│
                              │ id (PK)              │
                              │ product (FK)         │
                              │ contact_type         │
                              │ (email/phone/social) │
                              │ value                │
                              │ label                │
                              └─────────────────────┘

[T] = Translated field (django-modeltranslation creates _en and _bg columns automatically)
```

### Key Fields Explained

- **`pricing_type`**: Enum -- `free`, `freemium`, `paid`, `contact_for_pricing`
- **`is_featured`**: Shown on the hero/index page
- **`[T]` fields**: Managed by `django-modeltranslation` -- each translated field gets `_en` and `_bg` columns (e.g., `name` becomes `name_en`, `name_bg`). The bare field (e.g., `name`) returns the value for the active language with fallback to English.
- **`link_type`**: Enum -- `website`, `demo`, `documentation`, `video`, `github`
- **`contact_type`**: Enum -- `email`, `phone`, `facebook`, `linkedin`, `other`

## Installation & Development Setup

### Prerequisites

- Docker & Docker Compose
- Git

That's it -- everything else runs inside containers.

### 1. Clone and Configure

```bash
git clone <repo-url> softwareico
cd softwareico
cp .env-sample .env
# Edit .env with your values (defaults work for local dev)
```

### 2. Start Everything

```bash
docker compose up --build
```

This starts all services:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 3. First-Time Setup (run once)

```bash
# Run migrations
docker compose exec backend python manage.py migrate

# Create superuser for Django admin
docker compose exec backend python manage.py createsuperuser

# (Optional) Load sample data
docker compose exec backend python manage.py loaddata sample_data
```

### 4. Stop Everything

```bash
docker compose down          # stop containers
docker compose down -v       # stop and remove volumes (wipes DB)
```

### Useful Commands

```bash
# Backend shell
docker compose exec backend python manage.py shell

# Run backend tests
docker compose exec backend python manage.py test

# Install new Python package
docker compose exec backend pip install <package>
# Then add it to backend/requirements.txt

# Install new npm package
docker compose exec frontend npm install <package>

# View logs
docker compose logs -f backend
docker compose logs -f frontend
```

## Project Structure

```
softwareico/
├── docker-compose.yml
├── .env-sample
├── .env                     # (git-ignored)
├── README.md
├── CLAUDE.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/              # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── products/            # Main app
│   │   ├── models.py        # Product, Category, Tag, etc.
│   │   ├── translation.py   # django-modeltranslation registration
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── filters.py       # django-filter config
│   │   └── management/
│   │       └── commands/
│   │           └── seed_data.py
│   └── media/               # Uploaded images (git-ignored)
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.jsx         # Entry point
│       ├── App.jsx           # Router setup
│       ├── api/             # API client (axios)
│       │   └── client.js
│       ├── components/      # Reusable UI components
│       │   ├── layout/      # Navbar, Footer, Container
│       │   ├── ui/          # Buttons, Cards, Badges, Inputs
│       │   └── product/     # ProductCard, ProductFilter, etc.
│       ├── pages/           # Route-level components
│       │   ├── IndexPage.jsx
│       │   ├── ProductListPage.jsx
│       │   └── ProductDetailPage.jsx
│       ├── hooks/           # Custom React hooks
│       │   └── useProducts.js
│       └── styles/
│           └── globals.css  # Tailwind directives + custom CSS
│
└── nginx/                   # (production only, not needed for dev)
    └── default.conf
```

### Frontend Structure Explained (for backend devs)

If you're coming from Django, here's how to think about the React side:

| Django Concept       | React Equivalent                    | Example                        |
| -------------------- | ----------------------------------- | ------------------------------ |
| `views.py`           | `pages/` directory                  | `ProductListPage.jsx`          |
| `urls.py`            | `App.jsx` (React Router)            | `<Route path="/products">`     |
| Template tags        | Components in `components/`         | `<ProductCard product={p} />`  |
| `context` dict       | Props & State                       | `useState`, `useEffect`        |
| Template inheritance | Layout components                   | `<Layout><Page /></Layout>`    |
| `requests` library   | `api/client.js` (axios)             | `api.get('/products/')`        |
| Django filters       | Query params + `useSearchParams`    | `?category=crm&sort=name`     |

**Key React patterns you'll see:**

- **Components** = reusable UI pieces (like template partials). They receive data via `props`.
- **Pages** = top-level components that map to routes. They fetch data and compose components.
- **Hooks** (`useXxx`) = reusable logic. `useProducts()` handles fetching & caching product data.
- **State** (`useState`) = like a Python variable that re-renders the UI when it changes.
- **Effects** (`useEffect`) = code that runs after render (API calls, subscriptions).

## API Endpoints

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/api/products/`           | List products (filtered) |
| GET    | `/api/products/:slug/`     | Product detail           |
| GET    | `/api/categories/`         | List categories          |
| GET    | `/api/tags/`               | List tags                |
| GET    | `/api/stats/`              | Counts for hero section  |

### Query Parameters for `/api/products/`

| Param      | Example                  | Description                      |
| ---------- | ------------------------ | -------------------------------- |
| `search`   | `?search=crm`           | Full-text search name + desc     |
| `category` | `?category=crm`         | Filter by category slug          |
| `tags`     | `?tags=ai,automation`   | Filter by tag slugs (comma-sep)  |
| `pricing`  | `?pricing=free`         | Filter by pricing type           |
| `ordering` | `?ordering=-created_at` | Sort field (prefix `-` for desc) |
| `page`     | `?page=2`               | Pagination                       |

## License

Private -- All rights reserved.
