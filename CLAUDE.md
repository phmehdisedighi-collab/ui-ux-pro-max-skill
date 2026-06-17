# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo has two independent sub-projects:

1. **UI UX Pro Max skill** (`src/ui-ux-pro-max/`) — an AI design intelligence toolkit: searchable databases of UI styles, palettes, fonts, chart types, and UX rules. Distributed as a Claude Code skill and an npm CLI (`uipro-cli`).
2. **Owj Academy website** (`website/`) — a personal brand/consulting site for Mehdi Sedighi (in Persian + English), built with Next.js + Supabase + ZarinPal.

---

## Part 1 — UI UX Pro Max Skill

### Commands

```bash
# Search the design databases
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max_results>]
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>

# Generate a full design system for a product
python3 src/ui-ux-pro-max/scripts/search.py "beauty spa" --design-system -p "Serenity Spa"
python3 src/ui-ux-pro-max/scripts/search.py "fintech" --design-system -f markdown

# Sync data/scripts/templates into cli/assets/ before publishing CLI
cp -r src/ui-ux-pro-max/data/* cli/assets/data/
cp -r src/ui-ux-pro-max/scripts/* cli/assets/scripts/
cp -r src/ui-ux-pro-max/templates/* cli/assets/templates/
# or use the sync script:
python3 src/ui-ux-pro-max/data/_sync_all.py
```

**Domain values:** `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`

**Stack values:** `html-tailwind` (default), `react`, `nextjs`, `astro`, `vue`, `nuxtjs`, `nuxt-ui`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`, `angular`, `laravel`, `threejs`

### CLI (uipro-cli)

```bash
cd cli
bun run build          # compile src/index.ts → dist/index.js
bun run dev            # run without compiling (dev mode)

# Test locally after build
node dist/index.js init --ai claude --offline
```

### Architecture

```
src/ui-ux-pro-max/           # Source of Truth — always edit here
├── data/*.csv               # Design databases (products, styles, colors, typography, landing, charts, ux)
│   └── stacks/*.csv         # Per-stack code guidelines (react.csv, nextjs.csv, …)
├── scripts/
│   ├── search.py            # CLI entry point (domain search + stack search + --design-system)
│   ├── core.py              # BM25 + regex hybrid search engine
│   └── design_system.py    # Reasoning engine: maps product type → full design system
└── templates/
    ├── base/skill-content.md       # Shared SKILL.md content for all platforms
    ├── base/quick-reference.md     # Quick reference (Claude-specific)
    └── platforms/*.json            # Per-platform install configs (claude.json, cursor.json, …)

cli/
├── src/commands/            # init.ts, update.ts, versions.ts, uninstall.ts
├── src/utils/template.ts    # Template rendering engine (reads platforms/*.json + base/*.md)
└── assets/                  # Bundled copy of data/, scripts/, templates/ (synced before publish)

.claude/skills/ui-ux-pro-max/   # Symlinks → src/ui-ux-pro-max/ (used by Claude Code skill)
.factory/skills/ui-ux-pro-max/  # Symlinks → src/ui-ux-pro-max/ (Droid/Factory skill)
.shared/ui-ux-pro-max/          # Symlink → src/ui-ux-pro-max/
```

**Sync rule:** edit only in `src/ui-ux-pro-max/`. The `.claude/`, `.factory/`, `.shared/` folders are symlinks and get changes automatically. The `cli/assets/` folder needs a manual sync (or `_sync_all.py`) before publishing to npm.

---

## Part 2 — Owj Academy Website

### Commands

```bash
cd website
npm install
npm run dev      # http://localhost:3000 → auto-redirects to /fa
npm run build    # production build (TypeScript errors fail the build)
npm run lint
```

`.env.local` is required (see `.env.example`). Key vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ZARINPAL_MERCHANT_ID`, `ZARINPAL_SANDBOX`.

**To give admin role to a user** (after they sign up):
```sql
update public.profiles set role = 'admin' where id = 'USER-UUID';
```

### Architecture

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · next-intl · Supabase SSR · ZarinPal · Google Calendar API

**Routing:** all pages live under `src/app/[locale]/` (`fa` = default, RTL; `en` = LTR). Middleware (`src/middleware.ts`) handles both next-intl locale routing and Supabase session refresh in one pass.

**i18n:** `src/i18n/routing.ts` defines locales. Translation strings are in `messages/fa.json` + `messages/en.json`. Server components use `getTranslations()`, client components use `useTranslations()`.

**Three Supabase clients — use the right one:**
- `src/lib/supabase/client.ts` — browser client (client components, `createBrowserClient`)
- `src/lib/supabase/server.ts` — server client with cookie forwarding (Server Components, Route Handlers)
- `src/lib/supabase/admin.ts` — service role client, bypasses RLS. **Server-only.** Used exclusively in payment verify handler.

**Pay-to-confirm booking flow:**
1. `/fa/booking` (client) — select package → select slot (slot marked `held` for 15 min) → POST `/api/payment/request`
2. `POST /api/payment/request` — creates `booking(pending)` + `payment(pending)`, calls ZarinPal, returns gateway URL
3. ZarinPal redirects back to `GET /api/payment/verify` — verifies with ZarinPal, on success: marks `booking=confirmed`, `slot=booked`, `payment=success`, creates Google Calendar event + Meet link (non-blocking if Google creds absent), redirects to `/booking/success`

**Payment security constraint:** amount is always read from the `bookings` row server-side, never from URL params. Status updates use the service role client only.

**Database schema** (migration: `supabase/migrations/0001_init.sql`):
- `profiles` — auto-created on signup via trigger; has `role (user|admin)`
- `consultation_packages` — seed data included (3 sample packages)
- `availability_slots` — admin creates; status: `open → held → booked`
- `bookings` + `payments` — written only via service role
- `webinars`, `courses`, `enrollments` — skeleton tables for future features

**Brand tokens** (Tailwind config):
- `surmei` = `#0E1E3C`, `surmei-mid` = `#1C3258` (navy)
- `gold` = `#E5A823`, `orange` = `#F2682C`, `teal` = `#0FA3A3`
- Utility classes: `.btn-owj`, `.btn-gradient`, `.card-owj`, `.input-owj`, `.gold-underline`, `.section`

---

## Git Workflow

Never push directly to `main`. Always:

1. `git checkout -b feat/...` or `fix/...`
2. Commit changes
3. `git push -u origin <branch>`
4. Create PR
