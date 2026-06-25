# Changelog

## [0.3.0] — 2026-06-25

### Changed (Breaking)
- **Auth.js v5 → Better Auth** — full migration to self-hosted Better Auth
- Server config: `betterAuth()` with Pool adapter (`search_path=auth`), email/password, Google + GitHub OAuth, `additionalFields`, `dash()` plugin
- Client SDK: `createAuthClient()` + `sentinelClient()`
- `next-auth` uninstalled, all imports replaced

### Removed
- `src/app/api/auth/[...nextauth]/route.ts` — old Auth.js route handler
- `src/types/next-auth.d.ts` — Auth.js type declarations
- `prisma/schema.prisma`: `Account`, `Session`, `VerificationToken` models + relations from `User`

### Added
- `src/lib/auth.ts` — Better Auth config with `AuthUser`/`AuthSession` types and `getAuthSession()` server wrapper
- `src/lib/auth-client.ts` — client SDK (`signIn`, `signOut`, `useSession`)
- `src/app/api/auth/[...all]/route.ts` — Better Auth API handler
- `src/app/api/sync-user/route.ts` — sync endpoint: creates `Users.User` record after Better Auth signup
- `scripts/migrate-users.ts` — one-time script to migrate existing Auth.js users to Better Auth tables

### Updated
- Login/Register forms: `authClient.signIn.email()` / `signIn.social()` / `signUp.email()`
- `proxy.ts`: cookie-based auth guard (`better-auth.session_token`) instead of `getToken()`
- `src/lib/actions.ts`: `getAuthSession()` instead of `auth()`, removed `registerUser`/`loginUser`
- All client components: `useSession()` from `@/lib/auth-client`, `signOut()` without `redirectTo`
- All server components: `getAuthSession()` server wrapper
- `src/app/(dashboard)/[username]/settings/page.tsx`: raw SQL queries for `auth.account`
- `next.config.ts`: removed `NEXTAUTH_URL` env passthrough
- `.env`: `BETTER_AUTH_URL` added, `NEXTAUTH_URL` removed

## [0.2.2] — 2026-06-25

### Added
- `proxy.ts`: auth guard for `/dashboard` and `/profile`
- Dashboard role-check layout (`Sudo`/`Admin` only)
- Register auto-login after signup

### Fixed
- Login redirect chain (`/profile` → `/login` loop)
- Vercel build timeout (split into hybrid server + client auth)
- User auto-creation on credential login if `Users.User` record missing

## [0.2.1] — 2026-06-24

### Fixed
- `NEXTAUTH_URL` resolution for Vercel deployment
- Theme flash on page load
- Route restructure for dashboard sections
- Primitive login/register UI consistency

## [0.2.0] — 2026-06-24

### Added
- SEO optimizations
- Legal pages (Terms, Privacy, Guidelines, Data)

### Changed
- UI/UX redesign: primitive/minimalist (border-2, flat, no shadows, centered card, system font)
- Fix login/register flow bugs

## [0.1.0] — 2026-06-23

### Added
- Initial release
- Next.js 16 with Turbopack
- Prisma (PostgreSQL — Neon)
- NextAuth v5 with credentials + Google/GitHub OAuth
- Dashboard with role-based access
- Projects (CRUD, showcase)
- Events pages
- Intelligence section (YouTube + GNews)
