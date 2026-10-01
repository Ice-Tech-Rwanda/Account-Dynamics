# Global Line Safaris

Premium tourism website and content management system for **Global Line Safaris**, a Rwanda-based travel company creating personalised journeys across Rwanda and East Africa.

## Tech stack

- Next.js 16 App Router and TypeScript
- Tailwind CSS v4 design tokens
- Prisma and PostgreSQL
- Auth.js admin authentication with role-based access
- Radix UI, shadcn/ui primitives, Framer Motion, and Lucide icons
- Vitest unit tests and Playwright end-to-end support

## Quick start

```bash
npm install
cp .env.example .env.local
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The protected CMS is available at `/admin`.

## Public website

- `/` — immersive homepage with CMS-managed destinations and packages
- `/about` — company introduction, philosophy, mission, and team
- `/destinations` and `/destinations/[slug]` — destination directory and details
- `/tour-packages` and `/tour-packages/[slug]` — tour listings and itineraries
- `/services` and `/services/[slug]` — travel services
- `/gallery` — travel photography
- `/plan-your-trip` — trip inquiry form
- `/contact` — general contact form

## CMS capabilities

The existing admin dashboard manages destinations, tour packages, services, homepage content, media, travel inquiries, SEO, website settings, users, roles, and audit logs. Public forms use server-side validation, rate limiting, idempotency protection, and optional email notifications.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Confirmed contact details

- Phone and WhatsApp: +250 793 885 400
- Email: info@globallinesafaris.rw
- Public address: KG 7 Ave, Kigali, Rwanda
