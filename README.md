# NearShop - Find Shops Near You

A GPS-powered shop discovery platform built for Ethiopia. Users can find nearby shops, navigate to them, leave reviews, and save favorites.

## What it does

- **Find nearby shops** using your GPS location
- **Interactive map** with OpenStreetMap (no Google Maps API key needed)
- **Search & filter** shops by category, name, or open status
- **Navigate** to any shop with turn-by-turn directions
- **Favorite shops** and keep a saved list
- **Leave reviews & ratings** for shops you visit
- **Admin panel** to manage shops, users, and view analytics

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Leaflet + React-Leaflet (maps)
- Framer Motion (animations)
- Tabler Icons

**Backend:**
- Python 3.14
- FastAPI
- SQLAlchemy (async)
- PostgreSQL + PostGIS
- Alembic (migrations)
- JWT auth (python-jose)

**Deployment:**
- Docker & Docker Compose
- GitHub Actions CI/CD

## Project Structure

```
nearshop/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/       # Pages (landing, dashboard, map, admin, etc.)
│   │   ├── components/ # Reusable components (navbar, sidebar, map, etc.)
│   │   ├── services/   # API client & service functions
│   │   ├── store/      # Zustand stores
│   │   ├── hooks/      # Custom hooks (debounce, geolocation)
│   │   └── types/      # TypeScript types
│   └── public/         # Static assets, PWA manifest
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/       # API endpoints (auth, shops, users)
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── services/  # Business logic (geo calculations)
│   │   └── core/      # Config, security, dependencies
│   ├── migrations/    # Alembic migrations
│   ├── seed/          # Seed data scripts
│   └── tests/         # pytest tests
├── docker-compose.yml
└── .github/workflows/ # CI/CD pipelines
```

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.14+
- PostgreSQL with PostGIS extension

### Quick Start (Docker)

```bash
# Clone the repo
git clone https://github.com/TesfayeCodes/nearest-shop-indicator.git
cd nearest-shop-indicator

# Start everything
docker-compose up --build
```

- Frontend: http://localhost:3001
- Backend API: http://localhost:8080/api/v1
- API docs: http://localhost:8080/docs

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Set up database
cp ../.env.example .env  # edit DATABASE_URL
python -m alembic upgrade head
python -m seed.seed_shops  # populate sample data

# Run server
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install

# Set API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

npm run dev
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |
| GET | `/api/v1/shops` | List shops (paginated) | No |
| GET | `/api/v1/shops/nearby` | Find nearby shops | No |
| POST | `/api/v1/shops` | Create a shop | Yes |
| POST | `/api/v1/shops/{id}/favorite` | Toggle favorite | Yes |
| POST | `/api/v1/shops/{id}/reviews` | Add review | Yes |
| GET | `/api/v1/users` | List users (admin) | Admin |

Full API docs available at `/docs` when running the backend.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page with features & signup CTA |
| Login | `/login` | User login |
| Register | `/register` | User registration |
| Dashboard | `/dashboard` | Main dashboard with map, shops, stats |
| Map | `/map` | Full-screen interactive map |
| Shops | `/shops` | Browse and search all shops |
| Favorites | `/favorites` | Saved shops list |
| Profile | `/profile` | User profile & settings |
| Settings | `/settings` | App settings |
| Admin | `/admin` | Admin panel for shop/user management |

## Known Limitations

- Geolocation only works over HTTPS or localhost
- No real-time WebSocket updates yet (planned)
- Social login (Google, GitHub) is UI-only, not connected to backend
- Map clustering not implemented for large datasets
- No offline support beyond PWA manifest

## Author

TesfayeCodes

## License

MIT
