# Diabetes Checker Backend (Node.js)

Express API for the diabetes checker app. Stores profiles and computes risk results.

## Setup

```bash
cd backend
npm install
```

## Environment

Copy `.env.example` to `.env` and set:

- `PORT` - Server port (default 3001)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon/public key

If Supabase is not configured, the backend uses in-memory storage (data is lost on restart).

## Run

```bash
npm run dev   # Development with auto-reload
npm start    # Production
```

## API

- `POST /api/profiles` - Create profile `{ gender }` → `{ id }`
- `PATCH /api/profiles/:id` - Update profile with any fields
- `GET /api/profiles/:id/result` - Get profile and computed result
- `POST /api/result` - Submit full profile, get result (for local mode)

## Frontend

Set `VITE_API_URL=http://localhost:3001` in the frontend `.env` to use this backend.
