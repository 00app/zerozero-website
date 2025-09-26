# ZeroZero API Starter (Vercel serverless + Neon)

This folder provides **serverless API functions** intended for deployment on **Vercel** alongside your Vite site.
They implement the endpoints we agreed:

- `GET /api/tips`
- `POST /api/tips/like`
- `POST /api/tips/actioned`
- `GET /api/offers`
- `GET /api/places`
- `POST /api/zai`
- `POST /api/notify`

## Quick start

1) Add these files to the root of your project (so `api/` and `vercel.json` live at repo root).
2) Install dependencies at the project root:
   ```bash
   npm i @neondatabase/serverless openai twilio
   ```
3) Create env vars on Vercel (Project → Settings → Environment Variables) using `.env.example` as a guide.
4) Run the migration against your Neon database (see `migrations/001_init.sql`).

## Notes

- Functions use **Neon Serverless** (`@neondatabase/serverless`) and assume `DATABASE_URL` is set with `sslmode=require`.
- `POST /api/zai` requires `OPENAI_API_KEY`.
- `POST /api/notify` requires Twilio creds and uses `TWILIO_FROM_NUMBER`.
- Adjust SQL and schema to your needs; this is a safe default based on our previous schema.