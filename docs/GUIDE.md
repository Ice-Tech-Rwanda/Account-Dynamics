# Developer Guide

How to extend the template the right way. Follow these conventions so every project built from the template stays consistent and cheap to rebrand.

## Architecture Model

```
app/          thin routing + data orchestration (server components fetch, pass props)
  domains/    feature modules: events, shop, support, join, gallery, ...
  components/ layout + brand + ui + shared (reusable, non-feature-specific)
  lib/        config, auth, prisma, validation, services
```

- **Server components by default.** Fetch in the page, pass data down as props. Only add `"use client"` when you need hooks or interactivity.
- **Admin pages that read `cookies()` / `headers()`** must export `export const dynamic = "force-dynamic"` to avoid static-generation errors during build.
- **Do not build JSX inside try/catch in a server page.** Extract a loader function (`loadX()`) and let the page render the error state, keeping `react-hooks/error-boundaries` happy.

## Adding a Page

1. Create `src/app/<route>/page.tsx` (or a `[slug]` folder for dynamic routes).
2. Compose the page from shared sections: `it-section`, `it-container`, `SectionHeading`, cards, buttons.
3. Pull all text/URLs/metadata from `siteConfig` (`src/lib/site.ts`) — no hard-coded brand literals.
4. If the page is admin-only, gate it (auth check + redirect) and add `export const dynamic = "force-dynamic"`.
5. Add nav/footer links in `src/lib/navigation.ts`, not in the page.

### Page skeleton (server component)

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/shared/SectionHeading";

export default async function ExamplePage() {
  const data = await fetchData(); // prisma or fetch
  return (
    <>
      <Header />
      <main>
        <section className="it-section">
          <div className="it-container"><SectionHeading kicker="Example" title="Hello" /></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

## Adding a Domain Module

Feature-specific code belongs under `src/domains/<feature>/`:

```
src/domains/shop/
  components/       # client components used only by this feature
  lib/              # feature services/queries
```

Keep feature components out of `src/components/` — that folder is for cross-feature, reusable primitives.

## Adding a Component

1. Reuse before you build: check `src/components/ui` (shadcn primitives), `src/components/shared`, and the `it-*` classes in `src/styles/components.css`.
2. Make variants configurable via props (see `Button`, `Badge` variant conventions).
3. Align to tokens — radius, shadow, and color must come from the token system, never hard-coded hex.
4. **Icons:** `lucide-react` is typed through a whitelist in `src/types/lucide.d.ts`. If an icon isn't there, add it to the whitelist before importing.
5. For a broadly useful primitive, put it in `src/components/shared` (or `ui`) and reference it in `docs/template.md`.

### Client component rules (react-hooks)

These are enforced by ESLint — write components that pass clean:

- **No sync state updates inside effects.** For initial-fetch effects use the async-IIFE + `cancelled` flag pattern:

```tsx
const [items, setItems] = useState<Item[]>(initialData ?? []);
useEffect(() => {
  if (initialData) return;          // already hydrated
  let cancelled = false;
  (async () => {
    try { const r = await fetch("/api/x"); setItems(await r.json()); }
    catch { /* noop */ }
  })();
  return () => { cancelled = true; };
}, [initialData]);
```

- **State that derives from props during render:** use a `prev` sentinel:

```tsx
const [prev, setPrev] = useState(initial);
if (prev !== initial) { setPrev(initial); setForm(initial); }
```

- **No `useRef` for "last rendered value" in effects** — track it with state and adjust during render.
- Keep `useCallback` on handlers passed to effects; deps arrays must be complete.

## Rebranding Checklist

1. `src/lib/site.ts` — name, tagline, description, URLs, socials, email, metadata.
2. `src/styles/tokens.css` — swap `:root` / `.dark` palette and fonts; adjust radius scale if needed.
3. `src/components/brand/Logo.tsx` — brand mark.
4. Grep for the old brand name across `src/` and replace leftovers.
5. Re-run `npm run build` — it fails on unknown utility classes, catching broken token references.

## State Components

Use the shared trio instead of bespoke spinners/empty boxes:

- `EmptyState` — icon + title + description + optional action
- `LoadingState` — spinner (role="status")
- `ErrorState` — alert + optional retry

## Tests

- **Unit tests** (`src/__tests__/{validation,members,donations,uploads}.test.ts`): pure logic — validation, formatting, services. No DB. Run with `npm test` (vitest, `globals: true`).
- **Integration tests** (`src/__tests__/*.test.ts` — e.g. `api-events`, `auth-flow`, `rankings`): DB-backed. Run with `npm run test:integration`; requires `DATABASE_URL`.
- **E2E tests** (`src/__tests__/e2e/*.spec.ts`): Playwright; require the app running and `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars.
- Match existing naming: pure tests live at `src/__tests__/<domain>.test.ts`.

## Quality Gates

Always run before finishing work:

```bash
npm run typecheck
npm run lint          # must report 0 problems (warnings and errors)
npm test
npm run build
```
