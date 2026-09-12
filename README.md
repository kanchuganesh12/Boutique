# Ethnic Womenswear Boutique

Brand-neutral ethnic-wear e-commerce storefront (sarees, kurtas, salwar sets, blouses, dupattas, kidswear).

## Stack

| Layer    | Tech                                          |
|----------|-----------------------------------------------|
| Frontend | React + TypeScript (Vite) + Tailwind CSS      |
| Backend  | FastAPI + Motor                               |
| Database | MongoDB                                       |

Design decisions: [`docs/design-brief.md`](docs/design-brief.md).

## Quick start

### Prerequisites

- Node.js 20+
- Python 3.11+
- MongoDB (local or Docker)

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env   # set MONGODB_URI if auth is required
python -m app.seed
python server.py
# or: uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Storefront: http://localhost:5173 (proxies `/api` → `:8000`)

## Project layout

```
frontend/   Vite React SPA
backend/    FastAPI + Motor
docs/       Design brief
```
