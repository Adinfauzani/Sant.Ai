# Collaboration Guide

Welcome to Sant.AI a platform where students collaborate on science,
technology, and artificial intelligence projects.

This guide explains how to contribute effectively.

---

## Code of Conduct

Be respectful. Be constructive. Assume good intent.

Harassment, trolling, and discrimination are not tolerated.

---

## How to Contribute

### 1. Find or Create an Issue

- Browse [open issues](https://github.com/riuvan/Santet/issues)
- If you have an idea, open a new issue first to discuss it
- Wait for maintainer feedback before starting work

### 2. Fork and Branch

```bash
git checkout -b feat/your-feature-name
```

Use conventional branch prefixes:

| Prefix     | Purpose                |
| ---------- | ---------------------- |
| `feat/`    | New feature            |
| `fix/`     | Bug fix                |
| `refactor/`| Code restructuring     |
| `docs/`    | Documentation          |
| `chore/`   | Tooling, dependencies  |

### 3. Development Setup

```bash
pnpm install
pnpm dev
```

See SETUP.md for detailed instructions.

### 4. Commit Messages

Use conventional commits:

```
feat: add user profile readme editor
fix: resolve avatar upload on mobile
refactor: extract markdown toolbar component
```

### 5. Open a Pull Request

- Target the `master` branch
- Link the related issue
- Describe what your PR does
- Keep PRs focused — one feature/fix per PR

---

## Code Style

- **TypeScript** — strict mode, no `any` where possible
- **React** — Server Components by default, `"use client"` only when needed
- **CSS** — Tailwind CSS v4, CSS custom properties for theme tokens
- **Components** — Prefer composition, keep files under ~300 lines

Run lint before pushing:

```bash
pnpm lint
pnpm typecheck
```

---

## Review Process

1. Maintainer reviews within 1-3 business days
2. Address feedback with additional commits
3. Once approved, maintainer merges

---

## Questions?

Open a [Discussion](https://github.com/riuvan/Santet/discussions) or
join our community channels.
