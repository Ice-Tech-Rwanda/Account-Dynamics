# Design System Reference

The template's visual language is extracted from a production website and standardized into a single source of truth. Change the values in `src/styles/tokens.css` and the brand data in `src/lib/site.ts` to rebrand — nothing else needs to move.

## Design Tokens

All tokens are CSS custom properties exposed to Tailwind through `@theme inline` in `src/styles/tokens.css`. Two files matter:

- **Palette + semantic values** — the `:root` (light) and `.dark` blocks at the bottom of `tokens.css`.
- **Utility mapping** — the `@theme inline` block maps tokens to Tailwind utilities (`bg-brand`, `text-accent`, `shadow-card`, ...).

### Color

Two opinionated brand colors plus a neutral/semantic set.

| Role | Utility | Light default | Dark default |
| ---- | ------- | ------------- | ------------ |
| Primary action | `brand` / `brand-strong` / `brand-soft` / `brand-subtle` | `#1B3A5C` (navy) | unchanged (surface-dependent) |
| Highlight / CTA | `accent` / `accent-strong` / `accent-soft` / `accent-subtle` | `#0E7C7B` (teal) | unchanged |
| Brand surfaces | `brand-bg` / `brand-bg-dark` / `brand-bg-dark-mid` | `#F7F9FC` | `#0D1B2A` |

Semantic colors follow the shadcn/ui contract: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent-foreground`, `destructive`, `border`, `input`, `ring`.

> **Naming rule:** `brand` = the primary action color. `accent` = the highlight/CTA color. `accent` utilities (`bg-accent`, `text-accent`, `hover:bg-accent-soft`) always map to the highlight color — they are **not** the shadcn hover gray.

### Typography

Loaded via `next/font/google` in `src/app/layout.tsx`:

- `--font-sans` → **Lexend** (body, UI, headings — default `font-sans`)
- `--font-serif` → **Merriweather** (used for editorial/quote moments)
- `--font-mono` → Lexend (for parity)

Headings use tight tracking (`tracking-[-0.03em]`) and heavy weights (`font-black`); body copy uses `font-sans` at slate contrast levels.

### Radius

Base `--radius: 0.75rem` (12px). Tiers derive from it so one change re-scales the whole system:

| Token | Value | Use |
| ----- | ----- | --- |
| `--radius-sm` | `-4px` (8px) | chips, inputs |
| `--radius-md` | `-2px` (10px) | small controls |
| `--radius-lg` | base (12px) | buttons, inputs |
| `--radius-xl` | `+4px` (16px) | cards |
| `--radius-2xl` | `+8px` (20px) | feature cards |
| `--radius-3xl` | `+12px` (24px) | hero panels |
| `--radius-4xl` | `+16px` (28px) | large cards, modals |

### Shadows

`shadow-soft`, `shadow-card`, `shadow-lift`, plus brand glows `shadow-glow-brand`, `shadow-glow-brand-strong`, `shadow-glow-accent`, `shadow-glow-accent-strong` (used on CTAs).

### Motion

`animate-float`, `animate-float-slow`, `animate-glow`, `animate-tile-in`, `animate-scroll`. Keyframes live in `src/styles/animations.css`.

## Component Classes (`it-*`)

`src/styles/components.css` defines the shared vocabulary. Prefer these before writing bespoke Tailwind:

| Class | Purpose |
| ----- | ------- |
| `it-section` / `it-container` | Standard vertical rhythm + centered width |
| `it-kicker` | Small uppercase eyebrow label (brand/accent) |
| `it-title` / `it-heading` | Section heading scale |
| `it-copy` | Body copy rhythm |
| `it-card` / `it-card-soft` / `it-card-dark` | Elevated surfaces |
| `it-glass` | Frosted panel for dark hero sections |
| `it-btn-brand` / `it-btn-accent` / `it-btn-secondary` | Legacy call-to-action buttons |
| `it-chip` / `it-chip-brand` / `it-chip-accent` | Status pills |
| `it-hero-shell` / `it-dark-panel` | Dark hero composition |
| `it-hero-glow` | Token-driven radial brand/accent glow overlay for dark hero sections (use instead of hard-coded radial gradients) |
| `it-float` / `it-tile` | Animated accents |

## Component Primitives

`src/components/ui` holds shadcn/ui primitives. Notable conventions:

- **Button** variants: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`, `brand`, `accent`.
- **Badge** variants: `default`, `secondary`, `destructive`, `outline`, `brand`, `accent`.
- `brand` = primary action (green). `accent` = highlight (gold).
- The `it-btn-*` classes in `components.css` are the pre-template equivalents; prefer `Button`/`Badge` for new work.

## Shared State Components

`src/components/shared` provides consistent loading, empty, and error states:

- `EmptyState` — icon + title + description + optional action
- `LoadingState` — spinner + optional label (has `role="status"`)
- `ErrorState` — alert styling + optional retry action
- `SectionHeading` / `StatCounter` / `RetryButton` — additional shared building blocks

## Dark Mode

A `.dark` class on `<html>` toggles the palette. All semantic and surface tokens have dark values; components reference tokens (not hard-coded colors) so dark mode is automatic. The theme is persisted in `localStorage` under `ad-theme` (`src/components/shared/ThemeProvider.tsx`).

## Verification

After changing tokens, confirm no unknown utilities are introduced:

```bash
npm run build
```

The build fails fast on invalid utility classes (e.g. a `hover:bg-accent-soft` with no matching `--color-accent-soft` token).
