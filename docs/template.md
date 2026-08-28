# Account Dynamics — Project Template

This repository is the **Account Dynamics** website, built on a reusable, production-ready Next.js starter. The shared design system, component vocabulary, and architecture were originally built for a client-specific starter and adapted for a Canadian accounting, tax, advisory and business analytics firm.

## Source Of Truth

- Brand, metadata, and contact defaults live in [src/lib/site.ts](../src/lib/site.ts).
- Navigation and footer link config live in [src/lib/navigation.ts](../src/lib/navigation.ts).
- Design tokens live in [src/styles/tokens.css](../src/styles/tokens.css).
- Shared component primitives live in [src/styles/components.css](../src/styles/components.css).
- Animation keyframes live in [src/styles/animations.css](../src/styles/animations.css).
- App-wide shell and metadata live in [src/app/layout.tsx](../src/app/layout.tsx).
- The brand mark lives in [src/components/brand/Logo.tsx](../src/components/brand/Logo.tsx).

See [DESIGN.md](./DESIGN.md) for the design system and [GUIDE.md](./GUIDE.md) for how to work with it.

## Design System Rules

- Use the token classes first: `bg-brand`, `text-brand`, `bg-accent`, `text-accent`, `shadow-card`, `rounded-3xl`, and the `it-*` utility classes.
- Prefer shared primitives from `src/components/ui`, `src/components/shared`, and `src/components/layout` instead of page-local copies.
- Keep spacing on the established rhythm defined by `it-section`, `it-container`, and the card/button tokens.
- Preserve the visual language: `brand` as the primary action color, `accent` as the highlight/CTA color, with dark atmospheric hero panels and soft elevated cards.
- Use the shared state components (`EmptyState`, `LoadingState`, `ErrorState`) so loading, empty, and error states stay consistent.

## Verification

- `npm run typecheck` — TypeScript (`tsc --noEmit`).
- `npm run lint` — ESLint flat config (must report 0 errors).
- `npm test` — unit tests (vitest, no database required).
- `npm run test:integration` — DB-backed integration tests (requires `DATABASE_URL`).
- `npm run build` — production build (must compile cleanly).
