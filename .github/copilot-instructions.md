# Copilot & AI Agent Instructions for deejpotter Repository

## Project Overview

This is a Next.js 16 portfolio site (see `readme.md`). It uses:

- **Next.js App Router**: Routes in `src/app/*`, components in `src/components/*`.
- **Tailwind CSS v4**: Configured via CSS (`src/styles/globals.css`) using `@import "tailwindcss"`, `@theme`, and `@plugin` directives.
- **Clerk Authentication**: Auth components in `src/components/ui/auth/`. The `AuthProvider` wraps the app when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set.
- **MongoDB**: API routes in `src/app/api/mongo-crud/route.ts` for CRUD operations.
- **Static assets and games**: Unity WebGL in `public/basicBases/Build/`.
- **Docs**: TypeDoc output goes to `public/docs`.

## Auth Architecture

Authentication uses Clerk with a graceful fallback pattern:

1. `src/app/layout.tsx` checks for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. If key exists: wraps app with `ClerkProvider` → `AuthProvider`
3. If key missing: renders children directly (no auth, builds without errors)

Key files:
- `src/components/ui/auth/AuthProvider.tsx` - Main auth context with `useAuth()` hook
- `src/components/ui/auth/AuthButton.tsx` - Login/signup/logout button component
- `src/contexts/AuthProvider.tsx` - Wrapper that safely handles missing Clerk keys

## AI Agent Tips

1. Read the README first to understand the correct workflow.
2. Use context7 to find exact documentation before making changes.
3. Use search tools (google, duckduckgo) for official docs when needed.
4. Keep existing code and comments; add detailed comments explaining purpose.
5. Prioritize updating files over creating new ones.
6. Track tasks in `.github/TODOs.md`.
7. Make a detailed plan before implementing changes.

## Architecture & Structure

- Pages: `src/app/*` (Next.js App Router)
- Components: `src/components/*`
- Styles: `src/styles/globals.css` (Tailwind v4 with `@theme` block)
- Tests: Vitest + React Testing Library (`vitest.config.ts`, `vitest.setup.ts`)
- Alias imports: `@/` → `src/`

## Developer Workflows

```bash
yarn dev          # Development server (Turbopack)
yarn build        # Production build (runs TypeDoc first)
yarn test         # Run Vitest tests
yarn lint         # ESLint
yarn docs         # Generate TypeDoc
```

## Tailwind CSS v4 Configuration

Tailwind v4 uses CSS-based configuration instead of JavaScript config files:

```css
/* src/styles/globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary: #1E9952;
  --color-light: #FDFDFD;
  --color-dark: #181821;
  /* ... other tokens */
}
```

Note: `tailwind.config.cjs` is IGNORED by Tailwind v4. All customization must be in CSS.
