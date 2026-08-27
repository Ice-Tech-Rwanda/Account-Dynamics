# Account Dynamics

A professional website for **Account Dynamics** — a Canadian accounting, tax, advisory and business analytics firm based in Toronto, Ontario.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** design system with CSS-variable tokens
- **Prisma** + SQLite database, **NextAuth.js** (Auth.js) admin auth
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

Open http://localhost:3000. The admin area is `/admin`.

## Services

- **Small Business** — Bookkeeping, Tax Advisory, Audits & Appeals, Compilation Engagement Reports, Historical Accounting & Compliance Catch-Up, Payroll, Corporate Restructuring
- **Personal Taxes** — Tax Filing, Tax Advisory, Estate Planning, Lifetime Capital Gains Exemption
- **Outsourcing** — CPA & Accounting Office Outsourcing, Corporate Group Outsourcing
- **Allied Services** — Financing & Business Plans, QuickBooks Onboarding

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/about` | About Us — Founder, Vision, Team |
| `/services` | Services overview |
| `/services/small-business` | Small Business services |
| `/services/personal-taxes` | Personal Taxes services |
| `/services/outsourcing` | Outsourcing services |
| `/services/allied-services` | Allied Services |
| `/industries` | Industries We Serve |
| `/why-choose-us` | Why Choose Us |
| `/contact` | Contact form and information |
| `/admin` | Admin dashboard |

## Contact

- **Phone:** 416-748-2042 | 416-450-5639
- **Address:** 55 Baywood Road, 2nd Floor, Toronto, Ontario M9V 3Y8
- **Hours:** Monday – Friday, 9:00 AM – 4:00 PM

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run db:generate` | `prisma generate` |
| `npm run db:push` | `prisma db push` |
| `npm run db:seed` | `prisma db seed` |

## Branding

Edit `src/lib/site.ts` (name, URLs, socials, contact info) and the `:root` / `.dark` blocks in `src/styles/tokens.css` (colors, fonts, radius) to rebrand.
