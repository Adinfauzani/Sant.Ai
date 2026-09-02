# Changelog

## [0.5.4] — 2026-09-01

### Added
- **AI MU chat at `/aimu`** — an in-house AI assistant landing page (`(public)/aimu/page.tsx`, hero + CTA, simple `profileFooter.tsx`) served by the `POST /api/chat` route (`apps/web/src/app/api/chat/route.ts`). Uses the AI SDK v7 (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) with `openai.chat()` (Chat Completions) because `@ai-sdk/openai` v4 defaults to the Responses API whose `item_reference` multi-turn input is rejected by Ollama Cloud. Endpoint configurable via `AI_BASE_URL`/`AI_API_KEY`/`AI_MODEL` env (`apps/web/.env.example`); default is the free public `gpt-oss:20b` on Ollama Cloud. A local Ollama custom build (`santaimu/aimu1.0`, base `llama3.2`) is also created on this machine for self-host fallback.
- **Persistent chat at `/chat/[id]`** (login-only, owner-checked) — full screen chat backed by new `AiMuChat` + `AiMuChatMessage` models in a dedicated **`model` DB schema** (tables `aimu_chat`/`aimu_chat_message`, `userId` without cross-schema FK; the shared `public` Postgres schema was dropped since it was unused). `/chat` without an id creates a fresh chat for logged-in users and redirects, and redirects guests to `/aimu`. Guests get a 1-question demo at `/chat?coba=1`, after which the input locks and a "Login untuk lanjut" button appears (`/login?next=/chat`; the login page now honors `?next=` for its redirect/callback URLs). Server actions live in `lib/aimuActions.ts`; `/api/chat` persists messages, auto-titles chats from the first user message, saves the assistant reply via the `result.text` promise when a `chatId` is sent, and rejects `chatId` without a session (401).
- **Chat UI** (`components/ai/aiChat.tsx`) — always-fullscreen streaming chat (`fixed inset-0`, fullscreen toggle removed) with `useChat` (`transport: new DefaultChatTransport({ api: "/api/chat", body: { chatId } })`, initial messages via the `messages` option; local `useState` + `sendMessage({ text })`), markdown rendering of AI replies (`react-markdown` + `remark-gfm` with theme tokens), an "AI MU" label beside each assistant reply and on the typing bubble, a 3-dot bouncing-wave typing indicator (keyframes `typing-dot` in `globals.css`) shown in both the header badge and an in-chat bubble, smart auto-scroll (only when near the bottom), a jump-to-bottom button, a "Percakapan baru" button (logged-in), and a close link back to `/aimu`.
- **Pure AI MU branding** — the UI and `SYSTEM_PROMPT` never mention the backing model/technology (no "GPT", "Ollama", etc.); the persona is presented as an in-house Sant.Ai assistant with a concise, casual Indonesian tone.
- **`@santai/ui` shared UI package** — every Radix/shadcn-style primitive (button, card, dialog, select, …) plus presentational components (`footer`, `guideCarousel`, `programCarousel`, `scientificBackground`, `youtubeEmbed`, and the ten `/about` section components) moved from `apps/web` into `packages/ui`, consumed via `@santai/ui/*` subpath exports (each file listed under `exports` in `packages/ui/package.json`).
- **Gravatar fallback for avatars** — `apps/web/src/lib/gravatar.ts` exposes `getAvatarUrl(email)` (pure-JS MD5, verified identical to Node's `node:crypto`), used in the profile sidebar and navbar when a user has no `image` set, so the avatar renders the account's photo by email (rounded/circular) instead of a bare initial. `d=mp` shows a placeholder when the email has no photo.
- **Tab icons in the public profile** — the GitHub-style tab bar now renders an icon per tab (Overview `LayoutDashboard`, Projects `FolderGit2`, Articles `FileText`) and is full-width across the top of the profile page (above the sidebar).
- **`ProfileReputation` cleanup** — only-renders the streak/weekly/monthly stat cards when a value is actually provided (no more fake `0` streak / `35%` / `60%`), labels localized to Indonesian ("Reputasi", "poin", "level berikutnya", "hari beruntun", "minggu ini", "bulan ini"), and the monthly stat now uses a distinct `CalendarRange` icon instead of duplicating `TrendingUp`.

### Changed
- **`/about` slimmed from ~880 lines to a 33-line assembler** — each section (hero, problem, ecosystems, workflow, values, engineering, roadmap, impact, CTA) and its data arrays were extracted verbatim into `@santai/ui/custom/*` components; the page now only imports and stacks them.
- **Public profile is a single GitHub-style tabbed page** — `/{username}` renders Overview/Projects/Articles/Activity/Achievements as panels switched client-side via `?tab=` (`router.replace`, no page navigation); the old `/{username}/projects|articles|activity|achievements` sub-routes were removed (now 404). Pinned projects wrapped by `components/profile/profileProjectCard.tsx`.
- **Profile tabs slimmed to Overview / Projects / Articles** — the **Activity** and **Achievements** tabs were removed; activity is still visible via the "Recent Activity" timeline at the bottom of Overview, and earned achievements remain in the sidebar's small "Achievements" block. Dead code (`activityItemsAll`, `achievementBadges`, `locked`) and unused imports were pruned.
- **`/aimu` removed, chat exits re-routed** — the `/aimu` landing page and its `aimuCta.tsx` component were deleted. `/ai` remains the AI MU product landing. The chat close ("X") button now goes to the user's profile `/{username}` when logged in, or `/ai` for guests; `/chat` without login now redirects guests to `/ai` instead of `/aimu`. AI MU entry points ("AI MU" nav link, navbar bot button, profile robot-face) point to `/ai` and/or `/chat`.

### Fixed
- **Footer and `/about` broken after the move to `packages/ui`** — Tailwind v4 in the web app wasn't scanning `packages/ui` sources, and the `@source` path in `apps/web/src/app/globals.css` had the wrong depth (three `../` reached `apps/`, not the repo root). Now `@source "../../../../packages/ui/src";` so `@santai/ui` classes are generated again (e.g. footer `2fr 1fr 1fr 1fr` grid, `bg-[#0b1120]` on the engineering section).
- **Footer self-imports** — `@santai/ui` components import sibling files locally (`./button`, `./scientificBackground`) instead of via their own package specifiers; column layout realigned (`items-start`, brand-width `2fr` grid) and the Help column is no longer hidden on mobile.
- **Email OTP rate limit** — OTP requests are rate-limited (1 per 60s).
- **Missing imports on `contact` and `aimu` pages** — `Mail`/`MessageSquare`/`Calendar` (lucide) added to `(public)/contact/page.tsx`; `Navbar`, `ProfileFooter`, `AiMuCta` imports added to the AI MU landing page (resolved TS2304 compile errors).
- **Profile layout restored** — reverted the GitHub "masthead" (cover + small avatar at top) back to the original sidebar layout: large 265px rounded avatar + name + bio + stats + location/website/Joined in the left sidebar, with the tabbed content to the right. The `ProfileMasthead` component and its usage were removed. Location/website render when populated.

## [0.5.3] — 2026-09-01

### Added
- **Radix UI Colors as the global palette** — added `@radix-ui/colors` dependency; `blue` scale (steps 1–12) embedded into the design tokens for both light and dark themes:
  - Light: `--primary-base` = `blue-11` (#0d74ce), `--primary-soft-base` = `blue-3`, `--accent-base` = `blue-9`, `--ring-base` = `blue-8`
  - Dark: `--primary-base` = `blue-10` (#3b9eff), `--primary-soft-base` = `blue-4`, `--accent-base` = `blue-9`, `--ring-base` = `blue-8`
  - Every app element (buttons, links, rings, accents) now uses the Radix blue scale consistently across themes
- **Plus Jakarta Sans** as the body + heading font (replacing the custom serif heading), keeping **JetBrains Mono** for mono
- **Slider theme toggle in navbar** — sun/moon sliding switch (`role="switch"`) replacing the icon-only button
- **Featured Projects section on home** — static grid of 4 real-style projects (AI MU, stunting ML model, amal usaha digitalization, research collaboration), each linking to `/showcase`
- **`pg` + `@types/pg`** dependencies

### Changed
- **Theme switching is now instant/full** — removed the degrade-to-seam sweep overlay; `toggle`/`setTheme` apply the theme directly
- **Global color transitions** tuned for smoothness: body `0.18s ease-out`, all elements `0.12s ease-out`
- **Hero headline** → **"Grow, build & create"** (short, no "earn" so it isn't mistaken for freelancing)
- **Hero stats block removed**; stats row deleted from the split hero
- **Hero "Bergabung" button** now links to `/register` (sign-up) instead of `/community`
- **`/about` section polish** — decorative canvas shapes across sections (Cara kerja, Nilai inti, Roadmap, Dampak) + card-level shapes; CTA now uses a solid Radix `blue-9` background; secondary/outline button contrast fixed so its label reads without hover

### Fixed (Auth / OAuth)
- **Google social login failing in prod with `?error=state_not_found`** — `apps/web/src/lib/authClient.ts` read `env.NEXT_PUBLIC_AUTH_API_URL`, which t3-env always fills with its default `http://localhost:3001`, so the client never fell back to `window.location.origin`. In prod the browser hit `localhost:3001` instead of the web origin; the OAuth state was created by the wrong instance and the Google callback then landed on the prod domain → `state_not_found`. Now reads raw `process.env.NEXT_PUBLIC_AUTH_API_URL` (undefined when unset in prod) and falls back to `window.location.origin` (web same-origin). Dev is unchanged since `.env` still sets the value to the local server. Requires a rebuild/redeploy (`NEXT_PUBLIC_*` is inlined at build time).

### Changed (Auth / routing)
- **Logged-in users are redirected from public pages to their profile** — `proxy.ts` now redirects `/`, `/about`, `/ai`, `/articles`, `/community`, `/contact`, `/events`, `/intelligence`, `/legal`, `/projects`, `/showcase`, `/status` to `/profile` when a session exists; returning to the home page requires logging out. `/dashboard/*` keeps its login guard.

### Removed
- Sweep/transition overlay (`.theme-sweep`) from the theme provider
- Custom serif heading font source (`Couse/Cause-VariableFont_wght.ttf`) in favor of Plus Jakarta Sans

## [0.5.2] — 2026-07-05

### Added
- **Workspace card redesign** — ProjectCard component redesigned with Radix UI design philosophy:
  - Status badges with semantic emoji (🟢 Live, 🟡 In Progress, 🔵 Featured, ⚪ Completed)
  - Creator section (avatar initial + name + university) revealed on hover
  - Tech tags: max 3 visible, `+N` overflow with Radix Tooltip
  - Metadata (contributors, rating) revealed on hover with delay
  - Progress bar animates once on viewport entry (IntersectionObserver)
  - Lightweight CTA "View Workspace →" with arrow slide on hover
- **Showcase mock data**: `creator`, `university`, `contributors`, `rating`, `updatedAt`, `discussion` fields
- **Hover card popup**: now shows discussion content (longer project description) instead of short desc

### Changed
- **Card styling**: removed glass/blur (`bg-surface/80 backdrop-blur-sm`) → solid `bg-card` on events page for cleaner white background rendering
- **Card interactions**: `translateY(-4px)` + `scale(1.015)` + border→primary on hover (no glow/bounce)
- **Card borders**: simplified `rounded-[24px]` → `rounded-xl`, `shadow-lg` → `shadow-sm`
- **Status badges**: unified styling with `bg-surface ring-1 ring-border text-muted` — only emoji differentiates status
- **Accent bar**: simplified from per-project gradient → `from-primary/20 to-primary/5`
- **Accent border**: removed complex color extraction → `border-primary/20`
- **Star icon**: hardcoded `fill-amber-400` → theme token `fill-accent`
- **Events page text**: `text-[10px]` → `text-xs`, `text-muted` → `text-secondary` for readability on white background
- **Events page icons**: `h-3 w-3` → `h-3.5 w-3.5 text-primary` for better visibility
- **Hover card**: side changed from `top` to `right` on desktop

### Removed
- Gradient border glow layer from ProjectCard
- `updatedAt` from card metadata (kept in HoverCard popup)
- Unused `Clock` import from ProjectCard

### Cancelled
- **Python REST API migration** — cancelled, staying with current architecture

## [0.5.0] — 2026-06-27

### Added
- **3-column developer portfolio layout** — sidebar (288px, sticky) + main (flex-1) + right panel (240px)
  - `profile-sidebar.tsx`: responsive avatar (`size-24`/`md:size-56`/`lg:size-72`), bio, meta, followers/following, org badge
  - `profile-reputation.tsx`: animated XP Progress bar, level threshold colors, streak, weekly/monthly trends
  - `profile-badges.tsx`: Radix HoverCard badge pills with description + earned/locked status
  - `profile-tech-stack.tsx`: tech pills with logo abbreviation + Radix Tooltip
  - `profile-statistics.tsx`: 2-column stat dashboard cards (reputation, projects, contributions, ideas, teams)
  - `profile-activity-timeline.tsx`: IntersectionObserver fade-in + staggered delay, points badge
  - `profile-community-card.tsx`: community list cards with role badge, member count
- `.github-readme` CSS styling layer (~180 lines in `globals.css`) — covers headings, tables, images, code, blockquotes, lists, details/summary, shields.io badges, GitHub stats cards, SVG, alignment attributes, mobile overrides, fade-in
- **Radix UI shadcn-style wrappers**: `tabs.tsx`, `tooltip.tsx`, `avatar.tsx`, `scroll-area.tsx`, `separator.tsx`
- **Premium design tokens**: `--color-primary-soft`, `--color-accent`, `--color-ring`, `card-hover` utility
- **Project documentation**: `SECURITY.md`, `COLLABORATION.md`, `SETUP.md`
- **Apache 2.0 license** with `Copyright 2025 Adin Fauzan`

### Changed
- **License: MIT → Apache 2.0** — OSI-approved open source, mandatory attribution, patent protection
- **All hyphenated filenames → camelCase** (49 files): every `kebab-case` file renamed to `camelCase`
  - 2-word files: `login-form` → `loginForm`, `register-form` → `registerForm`, `auth-client` → `authClient`, etc.
  - 3+ word files simplified to 2 words: `profile-activity-timeline` → `activityTimeline`, `profile-community-card` → `communityCard`, `profile-tech-stack` → `techStack`, `how-it-works` → `guideSection`, `how-it-works-carousel` → `guideCarousel`, `project-card-with-pin` → `pinnedCard`
  - Component exports renamed to match: `ProfileActivityTimeline` → `ActivityTimeline`, `ProfileCommunityCard` → `CommunityCard`, `ProfileTechStack` → `TechStack`, `ProjectCardWithPin` → `PinnedCard`, `HowItWorks` → `GuideSection`, `HowItWorksCarousel` → `GuideCarousel`
  - All imports updated across entire codebase
- **Role names capitalized**: `"user"` → `"User"` (default), `"sudo"` → `"Sudo"`; full roles: `Sudo`, `Admin`, `Riset`, `User`, `Collab`
- **CHECK constraint** added on `auth.user.role` — hanya menerima: `Sudo`, `Admin`, `Riset`, `User`, `Collab`
- **Column type** `text` → `user_role` (PostgreSQL ENUM) — dropdown pilihan di Neon Console
- **Profile layout** (`layout.tsx`): simplified header (cover + name + settings), Radix ScrollArea tabs for horizontal mobile scrolling
- **Profile header**: avatar/bio/reputation removed (moved to sidebar); settings icon only next to name
- **Profile overview** (`page.tsx`): three-column layout with all sections wired (sidebar, contribution graph, streak, pinned, README, activity, featured, statistics, communities)
- **Settings form** (`_edit-profile.tsx`): bio textarea re-added + collapsed README with `ChevronDown`
- **`_markdown-editor.tsx` & `profile-readme.tsx`**: removed `{...props}` spread from all component overrides; switched to `.github-readme` CSS class; added `details`/`summary`/`input[type=checkbox]` components
- **`layout.tsx`**: `<Script>` moved from `<head>` to `<body>` (Next.js 16 requirement)
- **rehype plugin order**: `[rehypeRaw, rehypeHighlight]` — raw HTML parsed first, then syntax highlighting; `{...props}` removed from component overrides

### Fixed
- Next.js 16 "Encountered a script tag" error — `<Script>` must be in `<body>`
- Syntax highlighting broken by `rehype-raw` + `{...props}` spread — reorder to `[rehypeRaw, rehypeHighlight]`, remove spread
- GitHub README rendering: all styling delegated to `.github-readme` CSS class instead of per-component overrides

### Removed
- `src/components/profile/` unused files (consolidated into sidebar-based architecture)

## [0.4.0] — 2026-06-26

### Breaking
- **Prisma `User` model moved to `auth.user`** — `Users.User` table removed, Prisma now reads/writes directly to Better Auth's `auth.user` table
  - No more sync between two user tables — `prisma.user` is the same as `auth.user`
  - `/api/sync-user` endpoint removed (redundant)
  - `updateProfile` no longer does raw SQL sync to `auth.user`
  - `Pool` import removed from `actions.ts`
  - Register form sends `username`, `studyProgram`, `semester` directly to `authClient.signUp.email()`
  - Profile redirect page simplified (no more sync API call)
- **Prisma schema cleaned up**: `Users` schema removed from datasource, `UserRole`/`Plan` enums removed (Better Auth stores roles/plans as strings)

### Added
- **Email service (Resend)** — custom HTML templates via Resend (subject "Verify Your Sant.Ai Account", OTP in monospace, expiry, footer)
  - Falls back to console.log if `RESEND_API_KEY` not set
  - `@better-auth/infra` `sendEmail` kept as secondary (not enabled on current plan)
- **Username plugin** — replaced manual `additionalFields.username` with Better Auth's `username()` plugin
  - Normalization (lowercasing), `displayUsername`, `isUsernameAvailable` endpoint, `signIn.username()`
  - `usernameValidator` using `isReservedUsername` to block reserved names
  - `updateProfile` now uses `auth.api.updateUser()` so the plugin normalizes the username properly
- **Set password for OAuth users** — `POST /api/account/set-password` API route, `SetPasswordForm` component in Account tab
- **Two-factor authentication** — Better Auth `twoFactor` plugin with TOTP + backup codes
  - `TwoFactorSection` with QR generation (via QR Server API), 6-digit verification, backup codes display
  - `twoFactorClient` plugin on the auth client
  - `TwoFactor` model in Prisma schema (`auth.twoFactor` table, managed by `prisma db push`)
- **Settings sidebar** — new `_settings-client.tsx` with sidebar navigation (Profile, Account, Security, Appearance)
  - Responsive: sidebar on desktop, horizontal tab bar on mobile
  - `_two-factor.tsx` and `_set-password.tsx` as separate components
- **`src/lib/email.ts`** — email service module (Resend client + console fallback); added `sendOTP()` for OTP codes
- **Email OTP login** — Better Auth `emailOTP` plugin with `sendVerificationOTP` callback using Resend
  - Login form: toggle between **Password** mode and **OTP** mode
  - OTP mode: enter email → receive 6-digit code → verify & auto-sign-in
  - New users auto-registered on first OTP sign-in
  - `sendVerificationOnSignUp: true` — OTP sent after email/password registration
  - `overrideDefaultEmailVerification: true` — OTP replaces verification links
- **Multi-session support** — Better Auth `multiSession` plugin (max 5 sessions per device), `multiSessionClient` on client
- **OTP config** — emailOTP plugin configured: 6-digit OTP, 10-min expiry, 5 allowed attempts, 60s rate-limit window
- **VerifyOTP component** — shared verification UI (enter code, resend with cooldown, change email)
- **Post-registration OTP screen** — register form now shows OTP verification instead of "Welcome" screen; user must verify before redirecting to profile
- **Login auto-verification** — after password sign-in, if `emailVerified` is false, OTP is auto-sent and verification screen shown
- **Prisma schema**: added `Session`, `Account`, `Verification` models + `displayUsername` on `User` (fixes "relation session does not exist" error)

### Changed
- Settings page: full restructure with sidebar layout via `SettingsClient` client component
- `auth.ts`: email callbacks use `@better-auth/infra` `sendEmail`; `twoFactor`, `emailOTP`, `multiSession`, `username` plugins added; `AuthUser.twoFactorEnabled` field; `username` removed from `additionalFields`
- `auth-client.ts`: `twoFactorClient`, `emailOTPClient`, `multiSessionClient`, `usernameClient` plugins added
- Login form (`login-form.tsx`): mode toggle Password/OTP, OTP send + verify flow; after password sign-in, auto-detects unverified email and shows OTP verification
- Register form (`register-form.tsx`): post-registration shows `VerifyOTP` component instead of generic success page
- `email.ts`: rewritten with Resend custom HTML templates + `@better-auth/infra` fallback; better error logging with console fallback
- `ProfileRedirect` (`/profile/page.tsx`): auto-generates username from email for OAuth users instead of redirecting to `/login`
- `VerifyOTP` component: amber banner indicating OTP is in server terminal when email fails

### Changed
- **Roles lowercase**: default role `"user"`, plan `"free"` (was `"User"`/`"Free"`)
- **Sudo auto-assign**: `databaseHooks.account.create.after` — GitHub `@adinfauzani` + Google IDs `260724246` & `104172627992970621169` otomatis role `sudo`
- **Username check**: pake `POST /api/auth/is-username-available` (fix 404)
- **Linked accounts**: nampilin `@accountId` dari provider (e.g. `@adinfauzani`)
- **Profile header**: settings icon doang di samping nama, logout pindah ke Settings → Security → Session
- **Settings page**: + email change form, + logout section
- **`EditProfileForm`**: real-time username availability indicator (checkmark/cross + debounce)
- **`_verification.tsx`**: expandable form untuk change email
- **Register flow**: 2-step — Step 1 OAuth only (GitHub/Google), Step 2 profile (username, program, semester). Email/password removed. Auto-detect new OAuth user via auto-generated username pattern.
- **Navbar**: removed "Sign in" button, only "Get started" remains

## [0.3.1] — 2026-06-26

### Added
- **Email verification** — Better Auth built-in `emailVerification` config with `sendVerificationEmail` callback
  - OAuth users auto-verified (Google always, GitHub if email verified on GitHub)
  - Email/password users: `emailVerified = false`, must verify before content creation
- **Verification UI** — `VerificationSection` in settings (status badge + resend button)
- **Navbar indicator** — amber `AlertCircle` icon on avatar when email unverified
- **Content creation gate** — `requireEmailVerified()` check in `createProject`, `joinProject`, `completeProject`, `addComment`
- **Better Auth account APIs** — `auth.api.listUserAccounts` + `auth.api.unlinkAccount` replacing raw SQL + custom endpoint
- **New API route** — `POST /api/account/unlink` (wraps Better Auth's `unlinkAccount`)
- **Account linking** — Better Auth auto-link by email; `accountLinking.enabled` + `trustedProviders`

### Removed
- `src/app/api/account/unlink/[provider]/route.ts` — custom unlink (replaced by Better Auth's built-in)

### Updated
- Settings page: fetches `auth.api.listUserAccounts` server-side, passes `emailVerified` to `VerificationSection`
- `auth.ts`: enabled `emailVerification`, `account.accountLinking`, `user.changeEmail`
- `LinkedAccountsSection`: calls `/api/account/unlink` instead of `/api/account/unlink/:provider`

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
