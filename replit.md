# Skillbuddy

A skills/services marketplace built with React, TanStack Start, TanStack Router, and Supabase.

## Stack

- **Framework**: TanStack Start (SSR React)
- **Router**: TanStack Router (file-based routing in `src/routes/`)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Backend**: Supabase (auth + database)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query

## Running the app

```bash
npm run dev
```

Runs on port 5000. Requires the following env vars (set in Replit Secrets):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

## Project structure

- `src/routes/` — File-based routes (TanStack Router)
- `src/components/` — Shared UI components
- `src/context/` — React context providers (Auth, Loader)
- `src/lib/` — Utility libraries (Supabase client, i18n, config)
- `src/hooks/` — Custom React hooks
- `src/assets/` — Static assets
- `supabase/` — Supabase migrations and config

## User preferences

- Keep existing project structure and stack — do not restructure or migrate.
