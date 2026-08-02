# Ice Tech Rwanda Template

A reusable, production-ready Next.js starter built by **Ice Tech Rwanda** for community, nonprofit, and business web applications. It ships with a shared design system, modular domain architecture, an admin dashboard, and a full API layer — so every new project starts from a proven foundation instead of a blank page.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** design system with CSS-variable tokens
- **Prisma** + SQL database, **NextAuth.js** (Auth.js) admin auth
- **shadcn/ui** primitives, **Radix UI**, **Framer Motion**, **lucide-react**, **zod**, **sonner**
- **Vitest** (unit) + **Playwright** (e2e)

## Quick Start

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL, NEXTAUTH_SECRET, etc.
npx prisma generate
npx prisma db push
npm run db:seed               # demo content (optional)
npm run dev
```

Open http://localhost:3000. The admin area is `/admin` (seed creates a demo admin login).

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config) — keep at 0 errors |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests (no DB required) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:integration` | DB-backed integration tests (needs `DATABASE_URL`) |
| `npm run db:generate` | `prisma generate` |
| `npm run db:push` | `prisma db push` |
| `npm run db:seed` | `prisma db seed` |

## Project Layout

```
src/
  app/                    # Next.js App Router (thin routing + data orchestration)
  components/
    brand/                # Logo + brand primitives
    layout/               # Header, Footer, Admin shell
    shared/               # ThemeProvider, EmptyState, LoadingState, ErrorState, ...
    ui/                   # shadcn/ui primitives (Button, Badge, Card, Input, ...)
  domains/                # Feature modules (events, shop, support, join, ...)
  lib/                    # site config, prisma, auth, validation, services
  styles/                 # tokens.css, components.css, animations.css
  __tests__/              # vitest unit tests (pure) + DB integration tests
```

## Documentation

- [docs/template.md](docs/template.md) — template rules and source-of-truth files
- [docs/DESIGN.md](docs/DESIGN.md) — design system reference (tokens, typography, branding)
- [docs/GUIDE.md](docs/GUIDE.md) — how to add pages, components, and rebrand
- [docs/GENESIS.md](docs/GENESIS.md) — the extraction & rebranding prompt for new projects

## Branding

Rebranding is a single-file change: edit `src/lib/site.ts` (name, URLs, socials, email) and the `:root` / `.dark` blocks in `src/styles/tokens.css` (colors, fonts, radius). See [docs/DESIGN.md](docs/DESIGN.md) for the details.
