# Setup Guide

## Prerequisites

- **Node.js** >= 20 (pnpm is installed via nvm, e.g. `~/.config/nvm/versions/node/v24.14.1/bin`)
- **pnpm** >= 9
- **PostgreSQL** >= 15 (or [Neon](https://neon.tech) serverless Postgres)
- **Git**

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/riuvan/Santet.git
cd Santet

# 2. Install dependencies
pnpm install

# 3. Copy environment variables (one file per app)
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env

# 4. Fill in .env (see Environment Variables below)

# 5. Generate Prisma client and push schema
pnpm db:generate
pnpm db:push

# 6. Start development servers (web + API server in parallel)
pnpm dev
```

The web app runs at `http://localhost:3000` and the API/auth server at `http://localhost:3001`.

---

## Environment Variables

Env files are split per app. Both files are gitignored; `.env.example` is committed.

### `apps/web/.env` (frontend — auto-loaded by Next.js)

```env
# Public URLs (exposed to client)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_AUTH_API_URL="http://localhost:3001"

# Firebase (client-only, optional)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."

# Better Auth Sentinel (client, optional)
NEXT_PUBLIC_BETTER_AUTH_IDENTIFY_URL="..."

# External data APIs (cron fetchers run inside this app)
GNEWS_API_KEY="..."
YOUTUBE_API_KEY="..."
LINEAR_API_KEY="..."

# --- Server-side secrets — MUST mirror apps/server/.env ---
# The web hosts an in-process Better Auth instance (Server Actions, proxy,
# /api/auth/[...all] fallback) and Prisma, so it needs the same credentials.
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3001"
RESEND_API_KEY="re_..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
```

### `apps/server/.env` (backend — loaded via `tsx --env-file=.env`)

```env
SERVER_PORT="3001"
BETTER_AUTH_URL="http://localhost:3001"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."
BETTER_AUTH_SECRET="..."
RESEND_API_KEY="re_..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
BETTER_AUTH_API_KEY="..."   # optional, Better Auth dashboard
```

> **Important:** `BETTER_AUTH_SECRET` must be identical in both files, otherwise
> sessions signed by the server will be rejected by the web's in-process auth
> (and vice versa). `DATABASE_URL`/OAuth/Resend are also duplicated for the same reason.

---

## Available Commands

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `pnpm dev`           | Start web + API server in parallel     |
| `pnpm build`         | Prisma generate + production build     |
| `pnpm start`         | Start production web server            |
| `pnpm lint`          | Run ESLint in every workspace package  |
| `pnpm typecheck`     | Run TypeScript check in every package  |
| `pnpm db:push`       | Push schema to database                |
| `pnpm db:generate`   | Regenerate Prisma client               |
| `pnpm db:seed`       | Seed database                          |
| `pnpm db:studio`     | Open Prisma Studio                     |

---

## Project Structure

```
sant.ai/
├── apps/
│   ├── web/                  # Next.js App Router (port 3000)
│   │   ├── src/app/          # Routes (App Router)
│   │   ├── src/components/   # Reusable React components
│   │   ├── src/lib/          # Utilities, server actions, auth client
│   │   └── .env              # Single env file for the whole monorepo
│   └── server/               # Hono API server (port 3001) — owns Better Auth /api/auth/*
│       └── src/index.ts      # Server entry: CORS + auth handler + health
├── packages/
│   └── shared/               # @santai/shared
│       ├── prisma/           # Schema + seed
│       └── src/              # db, auth config factory, email, reserved, generated client
├── pnpm-workspace.yaml
└── package.json              # Root orchestration scripts
```

---

## Architecture Notes

### Split Frontend / Backend

- **`apps/web`** (Next.js) handles UI, Server Actions, and the `src/proxy.ts` route guard.
- **`apps/server`** (Hono) owns the Better Auth HTTP API at `/api/auth/*` (sign-in, OTP, OAuth, sessions).
- **`packages/shared`** (`@santai/shared`) holds the Prisma schema/generated client and the `createAuth()` factory so both apps share one auth config. The web also instantiates auth in-process so Server Actions can call `auth.api.*` directly.
- Dev runs both apps on `localhost` — cookies are host-scoped, not port-scoped, so a session cookie set by the server on `localhost:3001` is sent to the web on `localhost:3000` too.

### Multi-Schema Database

The project uses Prisma with two PostgreSQL schemas:

- **`auth`** — Better Auth managed tables (users, sessions, accounts)
- **`Santai`** — Application tables (projects, teams, contributions)

### Auth

Authentication is handled by [Better Auth](https://better-auth.com). Config MUST stay in `packages/shared/src/auth.ts` (shared factory) — never fork it per-app. `trustedOrigins` includes the web origin so social sign-in works cross-origin.

### Styling

- Tailwind CSS v4 with CSS-first configuration via `@theme` directive
- CSS custom properties for theme tokens (light/dark mode)
- Radix UI primitives for interactive components
- shadcn/ui-style component wrappers
