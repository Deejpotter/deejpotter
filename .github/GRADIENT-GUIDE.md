# Gradient Utilities Guide

## Overview

Brand gradients are used as **accents**, not large fills: glows behind a section, thin accent lines, gradient text on one key phrase, and one gradient primary button per section. Big gradient backgrounds read as dated and make text harder to read (the old see-through navbar dropdown showed the page behind its links).

- **Colours:** brand green `--color-primary` (`#1E9952`), emerald `#10b981`/`#34d399` as the middle stop, and info blue `--color-info` (`#59B7CC`).
- **Location:** `src/styles/globals.css`, in `@layer utilities` under "Brand gradients".
- **Configuration:** CSS-first (Tailwind v4 `@theme` and `@layer` blocks). There is no `tailwind.config.js` involvement.
- **Motion:** transitions are 150–200ms, and hover lifts and animations are turned off for `prefers-reduced-motion`. That media feature detects a device setting asking to minimise non-essential motion, which matters because some animations can trigger discomfort for people with vestibular motion disorders ([MDN contributors, n.d.](#ref-mdn-reduced-motion)).

The classes documented here before 2026-09-26 (`primary-light-gradient`, `navbar-dropdown-gradient` and others) no longer exist.

## Utilities

### `text-gradient`
Green-to-blue gradient text for **one** key phrase in a heading.

```tsx
<h1>
  I build websites, custom tools, and{" "}
  <span className="text-gradient">physical parts.</span>
</h1>
```

Used in: home hero (`src/components/home/home.tsx`), 404 page (`src/app/not-found.tsx`).

### `gradient-line`
A 1px glowing accent line that fades out at both ends. Give it a height and position.

```tsx
<div aria-hidden="true" className="gradient-line absolute inset-x-0 bottom-0 h-px" />
```

Used in: bottom edge of the sticky header and of the Projects dropdown (`src/components/TopNavbar/TopNavbar.tsx`).

### `btn-gradient`
The primary call to action: brand gradient, white text, soft green glow that strengthens on hover. Add your own padding and radius.

```tsx
<Link href="/contact" className="btn-gradient rounded-full px-5 py-2.5 text-sm font-semibold">
  Start with a message
</Link>
```

Use one per section. Secondary actions are quiet outlines, e.g. `border border-white/15 text-white/90 hover:bg-white/5` on dark backgrounds.

Used in: home hero, 404 and error pages.

### `glow-card`
Card hover state: lifts 4px, border turns brand green, green glow underneath. Combine with the card's own border, background and padding.

```tsx
<article className="glow-card rounded-3xl border border-gray-200 bg-white p-5 shadow-bs dark:border-gray-800 dark:bg-gray-900">
```

Used in: home service cards.

### `nav-dropdown-in`
160ms fade and slide-down entrance for the navbar dropdown panel (none for reduced motion).

## Tailwind patterns (no custom class needed)

### Glows behind a section
Blurred circles behind the content. The section needs `relative isolate overflow-hidden` so the glows stay behind and inside it.

```tsx
<section className="relative isolate overflow-hidden bg-gray-950">
  <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/30 blur-3xl" />
  <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-24 -z-10 h-[22rem] w-[22rem] rounded-full bg-info/20 blur-3xl" />
  ...
</section>
```

### Dark panel with a green wash
Keeps the top dark for legibility and fades to brand green at the bottom:

```tsx
<div className="bg-gradient-to-b from-gray-950/95 to-primary/45 backdrop-blur-md">
```

### Tinted callout
Light brand tint for an info box:

```tsx
<aside className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-sky-500/10 p-5">
```

### Full gradient section
`src/templates/GradientHeroSection` still exists for a full-width gradient band (`gradientFrom` / `gradientTo` colour keys). Prefer the accent patterns above for new work.

## Adding a new gradient utility

1. Add it to the "Brand gradients" block in `src/styles/globals.css`, using the colour variables (`var(--color-primary)`, `var(--color-info)`) and `color-mix()` for transparency, not hard-coded rgba values.
2. Don't hand-write vendor prefixes. Autoprefixer adds them at build time (`postcss.config.cjs`), and stylelint's `property-no-vendor-prefix` rule rejects prefixed properties in the source ([Stylelint, n.d.](#ref-stylelint-prefix)).
3. Wrap any movement in a `prefers-reduced-motion: reduce` override.
4. Document it here with an example and where it's used.

## References

<a id="ref-mdn-reduced-motion"></a>MDN contributors. (n.d.). *prefers-reduced-motion*. MDN Web Docs. Retrieved September 26, 2026, from https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

<a id="ref-stylelint-prefix"></a>Stylelint. (n.d.). *property-no-vendor-prefix*. Stylelint. Retrieved September 26, 2026, from https://stylelint.io/user-guide/rules/property-no-vendor-prefix/
