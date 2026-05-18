# Design Handoff — holterservice.eu

This document tells the Designer where to edit to restyle the site globally
without touching component code. The contract is small on purpose: the
Designer should rarely need to leave `tokens.css`.

## Tech stack (relevant bits)

- **Astro 6** + plain CSS. Each `.astro` component scopes its own styles
  via `<style>` blocks.
- **Tailwind v4** (PostCSS) for utility classes. Tailwind reads from the
  same tokens via `@theme` in `src/styles/global.css`.
- No CMS. Content lives directly in `src/pages/*.astro` (Croatian).

## The contract

> 90% of restyling happens in **one file**:
> [`src/styles/tokens.css`](src/styles/tokens.css)

Tokens exposed there:

| Group       | Tokens                                                                                 |
| ----------- | -------------------------------------------------------------------------------------- |
| Color       | `--color-background`, `--color-foreground`, `--color-primary`, `--color-primary-contrast`, `--color-muted`, `--color-muted-foreground`, `--color-border`, `--color-accent` |
| Typography  | `--font-heading`, `--font-body`, `--font-mono`                                          |
| Type scale  | `--text-xs` … `--text-5xl`, plus `--leading-tight`, `--leading-snug`, `--leading-normal` |
| Spacing     | `--space-1` … `--space-32` (4px grid)                                                  |
| Radius      | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`             |
| Shadow      | `--shadow-sm`, `--shadow-md`, `--shadow-lg`                                            |
| Layout      | `--container-max`, `--container-prose`, `--header-height`                              |

Every component reads from these — change a token, the change ripples site-wide.

## Where reusable patterns live

Beyond the tokens, a tiny set of utility classes is defined in
[`src/styles/global.css`](src/styles/global.css):

- `.container` — page width wrapper
- `.section`, `.section-muted` — vertical rhythm + background variant
- `.prose` — long-form text width and spacing
- `.card` — bordered surface block
- `.btn`, `.btn-primary`, `.btn-secondary` — actions
- `.skip-link` — a11y skip-to-content

These rely on tokens for their values, so editing tokens is enough for most
visual changes. If you need to change the _structure_ of these (e.g. change
button padding logic), edit `global.css` itself.

## Component locations

Shared layout + chrome:

- `src/layouts/BaseLayout.astro` — `<html>`, `<head>`, header/footer slot, skip link.
- `src/components/Header.astro` — sticky nav, mobile toggle.
- `src/components/Footer.astro` — links, contact, legal.
- `src/components/Seo.astro` — title/meta/OG/Twitter/canonical generator.
- `src/components/PartnerForm.astro` — partner inquiry form (mailto for v1).

Pages (Croatian routes):

- `src/pages/index.astro` — `/` Početna
- `src/pages/usluga.astro` — `/usluga`
- `src/pages/za-partnere.astro` — `/za-partnere`
- `src/pages/za-pacijente.astro` — `/za-pacijente`
- `src/pages/o-nama.astro` — `/o-nama`
- `src/pages/partneri.astro` — `/partneri`
- `src/pages/kontakt.astro` — `/kontakt`
- `src/pages/privatnost.astro`, `src/pages/kolacici.astro`, `src/pages/impressum.astro` — legal.

## How to preview locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
npm run preview  # serve built dist/
```

Hot-reload covers `tokens.css`, so token changes show instantly.

## Conventions to keep

- **Mobile-first.** Default CSS targets ~360px; use `@media (min-width: 768px)`
  and `@media (min-width: 1280px)` breakpoints for larger.
- **Semantic HTML.** Use real `<h1>`–`<h4>`, `<nav>`, `<main>`, `<section>`,
  `<footer>`. Don't replace headings with styled divs.
- **No client JS unless necessary.** Astro is zero-JS by default — keep it
  that way for SEO + perf budget.
- **A11y.** Color contrast must stay ≥ WCAG AA. The current primary
  `#0e7490` passes against white text.
- **Croatian only.** All visible copy is Croatian; do not introduce English
  microcopy in chrome (alt text, aria-labels, etc).

## Brand assets (incoming)

When real assets land, replace:

- `public/favicon.svg`
- `public/og-default.svg` (consider exporting a PNG at 1200×630 and pointing
  `src/components/Seo.astro` at the PNG for better social compatibility)
- Token values for color + type (see `PLACEHOLDERS.md`).

## What NOT to do

- Don't hardcode colors in `.astro` files — always reference a token.
- Don't add Tailwind config files (`tailwind.config.js`); the v4 `@theme`
  block in `global.css` is the only config.
- Don't add a custom design system / illustration set — that's a later
  designer phase, scoped separately.
