# Changelog

All notable changes to Sant.Ai are documented here.

---

## [0.2.2] - 2026-06-25

### Added
- **Middleware → Proxy migration**: Auth guards moved from `middleware.ts` to `proxy.ts` (Next.js 16 native)
- **Edge auth guard**: `proxy.ts` decodes JWT via `getToken()`, protects `/dashboard/*` (role check) and `/profile` (auth check)
- **403 page**: `/unauthorized` + `<Unauthorized>` component for dashboard role denial
- **Reserved usernames**: `unauthorized` added to prevent route conflicts

### Fixed
- **Dashboard role leak**: Dashboard layout now checks `role in ["Sudo", "Admin"]`, returns 403 for "User" role (previously only checked `session?.user?.id`)
- **Register OAuth dead-end**: Added `useEffect` + `useSession()` to register page — redirects to `/{username}` after OAuth callback (was staying on register page)
- **Register success redirect**: "Go to Dashboard" → "Sign In" button that goes to `/login` instead of `/`
- **Credentials login redirect**: Uses `getSession()` then `router.push("/{username}")` directly instead of `router.refresh()` (which could leave user on login page)
- **Register OAuth redirect**: Removed explicit `redirectTo` — lets default redirect back to register page, then `useEffect` takes over

### Changed
- Navbar avatar link: `<a href={`/${username}`}>` — always points to public profile, never to login for authenticated users

---

## [0.2.1] - 2026-06-21

### Fixed
- **NEXTAUTH_URL hardcoded to localhost**: Added auto-detect logic — uses `VERCEL_URL` on Vercel, `http://localhost:3000` locally. Removed `NEXTAUTH_URL` from `.env` to prevent stale imports on deploy
- **Theme flash on refresh**: Inline script in `<head>` reads localStorage before React hydrates — no more flash to light mode
- **Cookie consent glass styling**: Redesigned to match primitive auth pages (`border-2`, `bg-background/80 backdrop-blur-md`)
- **Route restructure**: `/account/*` moved to `/security`, `/appearance`, `/notifications` — cleaner URLs
- **Login redirect**: OAuth & credentials login now redirects to `/{username}` instead of `/`
- **Reserved usernames**: Added `security`, `appearance`, `notifications`, `profile` to prevent route conflicts

### Changed
- Login/register redesigned: primitive/minimalist style (border-2, flat, no shadows, centered card layout)
- `ThemeProvider` now reads localStorage synchronously in `useState` initializer (no more hydration lag)
- `env.ts` cleaned up — removed unused variables

---

## [0.2.0] - 2026-06-21

### Fixed
- **ProfileHeader server component error**: Event handlers (`onClick`) cannot be passed to Server Component props — added `"use client"` directive to `ProfileHeader`
- **Profile redirect on username update**: `EditProfileModal` now calls `router.push('/{newUsername}')` after changing username instead of staying on the old URL

---

## [0.1.9] - 2026-06-20

### Added
- **Account linking**: Users can now link/unlink Google & GitHub OAuth providers from Security settings (`/account/security`)
  - `POST /api/account/link/[provider]` — initiates linking via cookie + OAuth flow
  - `POST /api/account/unlink/[provider]` — unlinks provider with guard (can't unlink only auth method)
  - Linked accounts UI with Connect/Disconnect buttons per provider
- **Real-time refresh countdown** on Data Intelligence page: shows `Next refresh in MM:SS` countdown synced with 1-hour polling interval
- **Profile editing on public profile** (`/{username}`): "Edit profile" button visible only to profile owner, opens inline modal with name/username/bio/avatar/website/location fields
- **Logout button** on profile page — only visible to profile owner, next to Edit profile button
- **`/profile` route** redirects to `/{username}` (or `/login` if not authenticated)

### Changed
- `signIn` callback now creates `Account` records for OAuth providers + handles account linking via `santet_link` cookie
- Profile route moved from `/account/profile` to `/{username}` — `/account/profile` directory deleted
- Navbar "Settings" link points to `/{username}` instead of `/account/profile`
- AccountNav "Profile" tab points to `/{username}` (dynamic from session)
- Login/register OAuth redirects: `/account/profile` → `/` (home page)
- `/account` root redirects to `/{username}` (falls back to `/account/security`)
- `updateProfile` action: removed stale `/account/profile` revalidation

### Removed
- `/account/profile` route and form component — replaced by inline edit modal on `/{username}`

---

## [0.1.8] - 2026-06-20

### Changed
- Dashboard sidebar: `sticky top-0 h-screen` — no longer scrolls with page content
- Footer: Stay Updated section border removed, blends with background
- Footer: Brand column widened (`2fr` grid ratio) so "Sant.Ai" description text doesn't wrap tightly
- Footer: Bottom legal links restored as inline row (Terms, Privacy, Guidelines, Data)
- **Data Intelligence**: Semua tombol "Fetch Now" dihapus — data auto-refresh via `usePolling` setiap 1 jam
- **Data Intelligence redesign** (research-focused):
  - Search bar + filter dropdowns (category, language, country) di bagian atas
  - Category quick-filter pills dengan count
  - Artikel cards dengan metadata riset (category badge, language, date, formatted citation)
  - "Cite" button tiap artikel — copy citation otomatis ke clipboard
  - Category distribution bar chart
  - Video references section (grid 4 kolom)
  - Hapus section redundan (Literasi Digital, Keamanan Digital, Isu Publik, YouTube terpisah)

### Fixed
- Duplikasi konten di footer.tsx — file ditulis ulang bersih

---

## [0.1.7] - 2026-06-20

### Added
- `ProgramCarousel` — "Three programs, one ecosystem" section: mobile swipe carousel dengan auto-slide 10 detik, desktop 3-column grid
- Card/border styling di "How It Works" carousel (sebelumnya plain text layout)
- Step numbers (`01`, `02`, `03`) di pojok kanan atas card

### Changed
- Old `how-it-works.tsx` (FeatureCard) tidak dipakai lagi, digantikan `how-it-works-carousel.tsx` dengan card styling
- Section inline grid di page.tsx di-extract ke komponen client `ProgramCarousel`

---

## [0.1.6] - 2026-06-20

### Changed
- Footer desktop 4 kolom: **Brand** | **Platform** | **Resources** | **Community**
- Platform: Showcase, Community, Events, Data Intelligence (Home dihapus)
- Resources: Documentation (Soon), Blog, API Reference (Soon)
- Community: GitHub, Discord, Instagram, YouTube (link column, bukan cuma icon)
- Gap antar kolom dikecilkan, brand column 2x lebar dari link column
- "Universitas Saintek Muhammadiyah" badge di hero: tambah `bg-surface` biar border terlihat

---

## [0.1.5] - 2026-06-19

### Added
- **User Profile System V1**
  - Root-level `/[username]` routes: Overview, Projects, Articles, Activity, Achievements
  - `/account/*` route group: Profile form, Security, Appearance, Notifications
  - `username String? @unique` + `coverImage`, `website`, `location` di User model
  - `src/lib/reserved.ts` — 21 reserved route names + `isValidUsername()`/`generateUsername()`
  - Profile components: ProfileHeader, ProfileTabs, StatsCard, ProjectCard, ActivityItem, BadgeItem
  - Account components: AccountNav, ProfileForm (client)
  - NextAuth session/JWT extended dengan `username`
  - `updateProfile` action: name, username, bio, avatar, website, location
  - `registerUser` auto-generate username dari name
  - OAuth sign-in auto-generate username

### Changed
- Navbar "Profile" link → `/[username]` (dinamis dari session)
- Navbar "Settings" link → `/account/profile`
- Old `/profile/[id]` dan `/profile/me` routes dihapus
- Project team member links: `/[username]` fallback ke `/profile/[id]`
- Registration/login redirects: `/profile/me` → `/account/profile`

---

## [0.1.4] - 2026-06-19

### Added
- **Multi-schema database**: `Santai` (business tables), `Users` (User model), `auth` (NextAuth)
- `@@schema("Santai")` pada semua model bisnis (Project, Article, Source, Idea, dll)
- `@@schema("Users")` pada User model + enums (UserRole, Plan)
- `@@schema("auth")` pada Account, Session, VerificationToken
- User table dipindah dari `Santai` ke `Users` schema via ALTER TABLE (data aman)
- Enums dipindah ke schema `Users`

### Note
- `prisma db push --accept-data-loss` digunakan karena shadow database corrupt
- Gunakan `node -e` dengan `pg` module untuk operasi manual (psql tidak tersedia)
- `channel_binding=require` di .env dihapus karena pg-module-compatibility

---

## [0.1.3] - 2026-06-20

### Added
- Font lokal via `next/font/local`:
  - **Cause** (variable `wght`) dari `public/fonts/Couse/` → body/content (`--font-body`)
  - **JetBrains Mono** (variable `wght`) dari `public/fonts/JetBrains/` → headings (`--font-heading`)

### Removed
- Dancing Script font dihapus dari `public/fonts/JetBrains/`

### Changed
- `globals.css`: `--font-sans` → `--font-body` + `--font-heading`
- `@theme` block: Tailwind utilities `font-body` dan `font-heading`
- Semua `<h1>`–`<h6>` otomatis pakai `--font-heading`

---

## [0.1.2] - 2026-06-18

### Added
- **How It Works carousel mobile**: swipe touch + auto-slide 8 detik, dot indicators only
- CTA mobile: buttons stack vertical, full width, reduced padding (`py-16 md:py-20`, `p-6 md:p-10`)

### Changed
- Intelligence page: mobile hanya tampilkan "All Articles" (`hidden md:block` untuk section lain)
- Intelligence header: `py-8` → `pt-1 pb-2` (lebih dekat ke navbar)
- Cookie Notice: `onClick={accept}` fix, hydration mismatch fix dengan `mounted` state pattern

---

## [0.1.1] - 2026-06-17

### Added
- Branding migration: Santet → **Sant.Ai** (Science, Technology & Artificial Intelligence)
- `src/lib/storage.ts` — localStorage utility dengan backward compatibility (`santet:` → `sant-ai:`)
- Legal page language selector: hanya English & Bahasa Indonesia

### Changed
- 17+ file update: metadata, hero, navbar/footer logo, login/register, package.json, User-Agent strings
- Legal pages (6 bahasa): semua "SANTET" → "Sant.Ai", language selector ke EN+ID
- localStorage keys migrated: theme, cookie consent, language preferences

---

## [0.1.0] - 2026-06-15

### Added
- Initial Sant.Ai release (forked from Santet)
- Landing page: Hero, Programs, How It Works, CTA sections
- Authentication: Email/Password + GitHub + Google OAuth
- Project collaboration system (Create, Team, Roles)
- Community forum with ideas, voting, comments
- Data Intelligence platform (articles, YouTube, sources)
- Events system with registration
- Dashboard with analytics
- Multi-language legal pages (6 languages)
- Dark/light theme support
- Database: PostgreSQL on Neon, Prisma ORM
