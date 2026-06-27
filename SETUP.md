# Setup Guide

## Prerequisites

- **Node.js** >= 20
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

# 3. Copy environment variables
cp .env.example .env

# 4. Fill in .env (see Environment Variables below)

# 5. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 6. Start development server
pnpm dev
```

The app is now running at `http://localhost:3000`.

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"

# Resend (email)
RESEND_API_KEY="re_..."

# GNews (news feed)
GNEWS_API_KEY="..."

# YouTube (video feed)
YOUTUBE_API_KEY="..."

# Firebase (optional, for additional auth)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

---

## Available Commands

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm dev`           | Start development server       |
| `pnpm build`         | Production build               |
| `pnpm start`         | Start production server        |
| `pnpm lint`          | Run ESLint                     |
| `pnpm typecheck`     | Run TypeScript check           |
| `pnpm format`        | Format code with Prettier      |
| `pnpm prisma studio` | Open Prisma Studio             |
| `pnpm prisma db push`| Push schema to database        |
| `pnpm prisma generate`| Regenerate Prisma client      |

---

## Project Structure

```
Santet/
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets, fonts, scripts
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   │   ├── layout/       # Layout components (navbar, footer)
│   │   ├── profile/      # Profile page components
│   │   └── ui/           # shadcn/ui primitives
│   ├── lib/              # Utilities, actions, auth, db
│   └── generated/        # Generated Prisma client
├── .env.example
├── SETUP.md
├── SECURITY.md
├── COLLABORATION.md
└── package.json
```

---

## Architecture Notes

### Multi-Schema Database

The project uses Prisma with two PostgreSQL schemas:

- **`auth`** — Better Auth managed tables (users, sessions, accounts)
- **`Santai`** — Application tables (projects, teams, contributions)

`prisma db push` only detects changes to the `Santai` schema. For `auth`
schema changes, use raw `ALTER TABLE` SQL.

### Auth

Authentication is handled by [Better Auth](https://better-auth.com).
It manages its own tables in the `auth` schema.

### Styling

- Tailwind CSS v4 with CSS-first configuration via `@theme` directive
- CSS custom properties for theme tokens (light/dark mode)
- Radix UI primitives for interactive components
- shadcn/ui-style component wrappers
