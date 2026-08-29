# Block Platform — Postgres-backed

Three pieces, three terminals:

## 1. Database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the dashboard, open the **SQL Editor**, paste the contents of
   `backend/schema.sql`, and run it. This creates the `blocks` table.
3. Go to **Project Settings → Database → Connection string → URI**.
   Copy the connection string (it looks like
   `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-xx-xxxx-1.pooler.supabase.com:6543/postgres`).
   Use the **pooled** connection (port 6543) — it's the one meant for
   apps like this rather than long-lived direct connections.
4. Fill in your actual password in place of `[YOUR-PASSWORD]`.

(Prefer Docker or a local Postgres instead? `docker-compose.yml` is still
in this project — run `docker compose up -d` and use the local
`DATABASE_URL` shown in `backend/.env.example` instead.)

## 2. Backend (Express API)

```bash
cd backend
cp .env.example .env    # paste your Supabase connection string into DATABASE_URL
npm install
npm start
```

Runs on `http://localhost:4000`. Two endpoints:

- `GET /api/blocks` — returns the whole tree as nested JSON
- `POST /api/blocks` — body `{ title, body, parentId }` (`parentId: null` for a root block)

## 3. Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173` (Vite's default) and talks to the API at
`http://localhost:4000` by default. To point it elsewhere, create
`frontend/.env` with:

```
VITE_API_BASE=http://your-api-host:4000
```

## What's persisted

Every block (title, body, and its `parent_id`) is written to the `blocks`
table in Postgres as soon as you hit Save — refreshing the page now reloads
the tree from the database instead of losing it.

## Not yet built

- Editing or deleting a block
- Reordering blocks within a level
- Any auth — the API is wide open, fine for local dev only
