# SoftwareICO - SaaS Product Directory for Bulgarian Businesses

A web platform where businesses can discover SaaS products tailored to their industry and problems. Think of it as a curated directory: a transportation company finds their ideal CRM, an OpenCart store owner finds the right AI chatbot integration -- all in one place.

**Target market:** Bulgaria first, then expanding to the rest of the world.

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Backend     | Django 5.x + Django REST Framework  |
| Frontend    | React 18 + Vite + React Router      |
| Database    | PostgreSQL 16                       |
| Cache       | Redis 7 (session cache, API cache)  |
| Styling     | Tailwind CSS + Framer Motion        |
| Container   | Docker + Docker Compose             |
| Admin       | Django Admin (built-in)             |

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
│ name                │       │ name                 │
│ name_bg             │       │ slug                 │
│ slug                │       └─────────────────────┘
│ description         │               ▲
│ description_bg      │               │ M2M
│ icon                │               │
│ order               │       ┌───────┴─────────────┐
└────────┬────────────┘       │ Product              │
         │ FK                 │───────────────────── │
         │                    │ id (PK)              │
         └───────────────────►│ category (FK)        │
                              │ name                 │
                              │ name_bg              │
                              │ slug                 │
                              │ tagline              │
                              │ tagline_bg           │
                              │ description          │
                              │ description_bg       │
                              │ logo                 │
                              │ website_url          │
                              │ pricing_type         │
                              │ pricing_details      │
                              │ pricing_details_bg   │
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
```

### Key Fields Explained

- **`pricing_type`**: Enum -- `free`, `freemium`, `paid`, `contact_for_pricing`
- **`is_featured`**: Shown on the hero/index page
- **`*_bg` fields**: Bulgarian translations (for i18n-ready data)
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

## Development Stages

### Stage 1: Project Scaffolding & Infrastructure

> **Goal:** Get all services running in Docker with hot-reload for both frontend and backend.

- [ ] Create `docker-compose.yml` with all services (postgres, redis, backend, frontend)
- [ ] Create backend `Dockerfile` and Django project (`config/` settings)
- [ ] Create frontend `Dockerfile` and Vite + React project
- [ ] Configure Django settings (database, CORS, media files, REST framework)
- [ ] Verify all containers start and talk to each other
- [ ] Configure `.env` and environment variable handling

### Stage 2: Backend -- Models, Admin & API

> **Goal:** A fully functional API with Django Admin for data management.

- [ ] Define models: `Category`, `Tag`, `Product`, `ProductImage`, `ProductLink`, `ProductContact`
- [ ] Create and run migrations
- [ ] Set up Django Admin with inline editors for images, links, contacts
- [ ] Create DRF serializers for all models
- [ ] Create API viewsets with list/detail endpoints
- [ ] Add filtering (by category, tags, pricing type) and search (by name, description)
- [ ] Add ordering (by name, created date, featured status)
- [ ] Add pagination to list endpoints
- [ ] Create a seed data management command with realistic sample products
- [ ] Test API endpoints manually / write basic tests

### Stage 3: Frontend -- Layout & Index Page

> **Goal:** A polished landing page with navigation and responsive layout.

- [ ] Set up Tailwind CSS and base theme (colors, fonts, spacing)
- [ ] Build layout components: `Navbar`, `Footer`, `Container`
- [ ] Build the Index/Hero page:
  - Animated hero section with headline and CTA
  - Stats counters (total products, categories, etc.) with count-up animation
  - Featured products carousel/grid
  - Category showcase section
  - Call-to-action / search bar
- [ ] Add Framer Motion animations (fade-in on scroll, hover effects)
- [ ] Ensure mobile responsiveness across all sections

### Stage 4: Frontend -- Product List Page

> **Goal:** A fully functional product browsing experience with filters and search.

- [ ] Build the `ProductListPage` with grid/list layout
- [ ] Build `ProductCard` component (logo, name, tagline, category badge, pricing badge)
- [ ] Build sidebar/top-bar filter panel:
  - Category filter (checkboxes or dropdown)
  - Tag filter (multi-select)
  - Pricing type filter
  - Search input (debounced)
- [ ] Add sort controls (name A-Z, newest, featured first)
- [ ] Add pagination or infinite scroll
- [ ] Sync filters with URL query params (so links are shareable)
- [ ] Add loading skeletons and empty-state messaging
- [ ] Mobile: collapsible filter panel

### Stage 5: Frontend -- Product Detail Page

> **Goal:** A comprehensive product page showing all information.

- [ ] Build the `ProductDetailPage` layout
- [ ] Product header: logo, name, tagline, category, pricing badge
- [ ] Description section with rich text rendering
- [ ] Image gallery (lightbox on click)
- [ ] Links section (website, demo, docs, video -- each with icon)
- [ ] Contact information section
- [ ] Tags display
- [ ] "Similar products" section at the bottom (same category)
- [ ] Breadcrumb navigation
- [ ] Mobile layout adjustments

### Stage 6: Polish, SEO & Performance

> **Goal:** Production-ready quality and performance.

- [ ] Add page titles and meta tags (react-helmet)
- [ ] Add OpenGraph tags for social sharing
- [ ] API response caching with Redis
- [ ] Image optimization (lazy loading, responsive sizes)
- [ ] Error boundary and 404 page
- [ ] Loading states and transitions between pages
- [ ] Accessibility review (keyboard nav, ARIA labels, contrast)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, mobile Safari)
- [ ] Lighthouse audit and fix flagged issues

### Stage 7 (Future): User Accounts & Expansion

> Not in initial scope, but planned:

- [ ] User registration / login
- [ ] Product reviews and ratings
- [ ] "Save to favorites" functionality
- [ ] Product submission form (for SaaS vendors)
- [ ] Multi-language UI (Bulgarian / English toggle)
- [ ] Analytics dashboard
- [ ] Expand beyond Bulgarian market

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
