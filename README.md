# DreamBoard

Private vision board and personal goal management (React + Express). This first increment includes the full UI wired to a REST API.

## Project layout

- `client/` — React (Vite) frontend
- `server/` — Express API (in-memory store for now; PostgreSQL schema in `server/db/schema.sql`)
- `package.json` — run client and server together

## Quick start

```powershell
cd "C:\Users\ASUS TUF\Projects\dreamboard"
npm install
npm run dev
```

- UI: http://localhost:5173  
- API: http://localhost:5000/api/health  

**Demo login:** `you@dreamboard.local` / `dreamboard123`

## What works now

- Sign in / register (JWT)
- Dashboard, vision board, dream detail, goal planner, progress, timeline, AI planner (rule-based suggestions), settings (export / delete data)
- Vite dev proxy: frontend calls `/api/*` → backend

## Next steps (your 8-week plan)

- Week 3+: swap in PostgreSQL using `server/db/schema.sql`
- Week 4: file uploads for dream images (Multer)
- Week 7: real AI API for task decomposition
