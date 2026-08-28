# Genesis Prompt — Adapt the Template for a New Client

You are the lead engineer assigned to a new project built on the **Next.js template**. Your job is to adapt it for the client's content — correctly and efficiently, preserving the design system and passing every quality gate.

## Your Context

The template is a production-grade Next.js 16 starter: a public site + admin dashboard + API layer + Prisma schema, all styled by one design system. The current project is **Account Dynamics** — a Canadian accounting, tax, advisory and business analytics firm.

## The Extraction Procedure (do this FIRST, before writing any new code)

1. **Copy, don't edit in place.** Copy the entire template directory to the new project location. Never modify the template itself.
2. **Remove all client-specific residue** (previous client content). Grep the whole tree for old brand names and replace or delete every hit. Do NOT leave branding orphans in comments, copy, metadata, or seed data.
3. **Rebrand via the source-of-truth files only** — this is a single, fast pass:
   - `src/lib/site.ts` — name, tagline, description, URLs, socials, email, metadata. (`siteConfig` is read everywhere; update it once, the shell follows.)
   - `src/styles/tokens.css` — swap the `:root` / `.dark` palette for the client's colors and fonts. Do NOT rename the tokens (`brand`, `accent`, `brand-soft`, ...) — that would break utilities everywhere.
   - `src/components/brand/Logo.tsx` — replace the brand mark.
   - `src/lib/navigation.ts` — nav + footer links for the new client.
   - `src/app/layout.tsx` — verify title/description/keywords metadata reflects the new brand.
4. **Replace the demo content**: `prisma/seed.js` (client's seed data, run `npm run db:seed`), and any static data files in `src/data/` — delete them or rewrite for the client. Do not ship the club's team members, events, products, or success stories.
5. **Env/setup**: copy `.env.example` → `.env`, fill real values, run `npm install`, `npx prisma generate`, `npx prisma db push`.

## Correct-Modification Rules (apply on EVERY change)

### Architecture
- **Server components by default.** Fetch in the page, pass data as props. Add `"use client"` only for hooks/interactivity.
- Feature code goes in `src/domains/<feature>/` (components + lib). Keep `src/components/` for cross-feature primitives only.
- Admin pages that read `cookies()`/`headers()` MUST export `export const dynamic = "force-dynamic"`.
- Never build JSX inside try/catch in a server page — extract a `loadX()` function; the page renders the error state. (Enforced by `react-hooks/error-boundaries`.)
- No hard-coded brand literals. Pull text/URLs/metadata from `siteConfig`.

### Design system
- Use token classes: `bg-brand`, `text-brand`, `bg-accent`, `text-accent`, `shadow-card`, `rounded-3xl`, and the `it-*` classes (`it-section`, `it-container`, `it-kicker`, `it-title`, `it-card`, ...) in `src/styles/components.css`.
- Reuse before you build: `src/components/ui` (shadcn Button/Badge with `brand`/`accent` variants), `src/components/shared` (EmptyState, LoadingState, ErrorState, SectionHeading, StatCounter, RetryButton, ThemeProvider).
- Colors/radius/shadows must come from tokens, never hard-coded hex.
- `accent` utilities = the highlight/CTA color (NOT the shadcn hover gray). `brand` = primary action.
- Dark mode: components reference tokens, so it's automatic — don't hard-code light-only colors.

### Client component rules (enforced by ESLint — pass clean)
- No synchronous state updates inside effects. Initial-fetch effects use the async-IIFE + `cancelled` flag pattern; when props already hydrate state, early-return from the effect.
- State derived from props during render: use a `prev` sentinel (`if (prev !== next) { setPrev(next); setValue(next); }`).
- No `useRef` "last rendered value" workarounds — track with state, adjust during render.
- Complete dependency arrays; wrap handlers passed to effects in `useCallback`.

### Icons & entities
- `lucide-react` imports are typed via a whitelist in `src/types/lucide.d.ts`. If the icon isn't listed, add it there first. (Whitelist currently includes `Linkedin`, `Package`, `Search`; `Inbox`, `PackageSearch` are NOT available.)
- Use `&apos;` / `&amp;` etc. in JSX text (enforced by `react/no-unescaped-entities`).

## Efficiency Guidelines

- Start by reading: `README.md`, `docs/DESIGN.md`, `docs/GUIDE.md`, `docs/template.md`. They encode every convention below — don't re-derive rules from scattered files.
- The four quality gates tell you you're done: `npm run typecheck` (0 errors), `npm run lint` (0 errors; warnings acceptable), `npm test` (34 baseline unit tests must stay green), `npm run build` (must compile; fails fast on unknown utility classes like `hover:bg-accent-soft`).
- When the build fails with "Cannot apply unknown utility class", you changed a token reference — fix the token in `tokens.css`, never add a one-off arbitrary class.
- Before you modify any component, open its neighbors to learn the established pattern. Match existing code style exactly — no comments unless the codebase comments.
- Batch read the source-of-truth files first (they're small), then make changes in one pass per area (branding, then data, then pages).

## Definition of Done

- Fresh project directory with the template extracted, old client content fully gone.
- New brand present in `site.ts`, `tokens.css`, `Logo.tsx`, `navigation.ts`, layout metadata.
- Client content seeded and rendering on the public pages.
- No dead client-specific code, routes, or data files remain.
- All four quality gates green: `typecheck`, `lint`, `test`, `build`.
- Summarize exactly what you changed, what you left alone, and how you verified.
