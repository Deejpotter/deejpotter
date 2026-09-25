# Copilot & AI Agent Instructions for deejpotter Repository

## Project Overview

This is a Next.js portfolio site (see `readme.md`). It runs on Render as a Node server (`yarn build` then `yarn start`), with Clerk for auth, MongoDB Atlas for data, Stripe for quote payments, and Cloudflare R2 for uploaded files:

- App code and routes: `src/app` (Next.js App Router).
- UI components: `src/components` and `src/templates` (reusable sections like `BasicSection` and `GradientHeroSection`).
- Auth: Clerk (`@clerk/nextjs`). `src/proxy.ts` runs `clerkMiddleware()` (Next.js 16's name for middleware). Client auth state lives in `src/components/ui/auth/AuthProvider.tsx`; server-side admin checks use `isAdminUser()` / `requireAdminPage()` in `src/lib/admin-auth.ts`, which allow the Clerk user IDs listed in the `ADMIN_USER_IDS` environment variable.
- API routes: `src/app/api/*/route.ts` (Next.js Route Handlers). Data access goes through `src/lib/db.ts` (`getCollection()`, which also creates indexes on first use) and the `src/lib/db-*.ts` modules.
- Static assets and games: `public/` (Unity WebGL in `public/basicBases/Build/`).
- **Docs**: TypeDoc output goes to `public/docs` (`typedoc.json` and `yarn docs`).

## AI Agent Tips

1. Read the README first to understand the correct workflow.
2. Use context7 to find exact documentation before making changes.
3. Also, use my-mcp-server's google and duckduckgo search tools to find officical documentation references or search online for information for things that don't have documentation.
4. Keep my current code and comments where possible or add your own detailed comments from my point of view to explain the purpose of the code.
5. Prioritize updating and improving files over creating new ones.
   Update my current files instead of making new ones and copying them over.

6. Each project should have a TODO list under .github/TODOs.md to show the workflow to follow for updates and additions.

7. First consider how to find the best actions. Then make a detailed plan. Remember this plan and refer back to it regularly to make sure you're on track.Then make the changes following the plan.

## Architecture & Structure (practical details)

- Pages live in `src/app/*`; components are kept in `src/components/*` and global styles in `src/styles/globals.css`.
- Styling uses **Tailwind CSS v4** with CSS-first configuration (`@theme` blocks in `src/styles/globals.css`). Custom design tokens for colors, spacing and typography are defined there. Legacy SCSS files may still exist but Tailwind utilities are the standard.
- Blog posts are written by hand: Markdown files in `src/content/blog-md` or TSX pages in `src/content/blog`, both loaded by `src/lib/blog.ts` (see `src/content/blog-md/README.md`). There is no CMS.
- Tests use Vitest + React Testing Library for unit/component tests and Playwright for E2E and visual tests. See `vitest.config.ts` and `playwright.config.ts`.
- When converting or adding UI components, add a top-of-file comment describing the purpose, rationale (e.g., Tailwind-first and accessibility considerations), and the testing approach (Vitest unit tests + Playwright visual test). Also include short block comments above major implementation sections explaining _why_ the structure was chosen (accessibility, performance, or testability), not only _what_ the code does.
- Alias imports use `@/` mapped to `src/` (resolved via `vitest.config.ts` for tests and `tsconfig.json` for the app).
- CSS and theme overrides: We use **Tailwind CSS** and utility classes in `src/styles` (see `TAILWIND-MIGRATION-PLAN.md` for migration notes). Tailwind-first development is the standard for new components.

## Developer Workflows (must-know commands)

- Local dev: `yarn dev` — Next.js dev server.
- Build (CI / production): `yarn build` (`next build`).
- Run tests: `yarn test`.
- Lint: `yarn lint`.
- Docs: `yarn docs` (writes to `public/docs`).
- CI: GitHub Actions runs lint, stylelint, Vitest and the build on pushes and PRs (`.github/workflows/ci.yml`).
- Env: example env vars are in `.env.example` (MONGODB_URI, DB_NAME).

- Deploys: Render auto-deploys `dev` to `deejpotter-staging` (staging.deejpotter.com) and `main` to `deejpotter` (deejpotter.com). Work on `dev` and merge to `main` through a PR.

## Integration Points & Environment

- Hosting: Render. Its filesystem is wiped on every deploy, so anything that must persist goes in MongoDB (quotes, users, contact leads, grocery orders, settings) or R2 (uploaded files, see `R2_SETUP.md`). R2 is only used once its variables are set; until then uploads fall back to the ephemeral local disk.
- Contact form: `src/app/contact` posts to `src/app/api/contact/route.ts`, which saves leads to the `contact_leads` collection. Admins see them at `/admin/leads`.
- Quotes: the 3D printing form posts to `/api/3d-printing-quote`. Laser work is engraving only (no laser cutting); laser and milling jobs are requested through the contact form.
- Local env example: see `.env.example` for required environment variables to run local dev and deploy to new hosts.

## Project-Specific Conventions

- Prefer `type` declarations and keep exported types in `src/types/*` (see `Project.ts`, `RepoObject.ts`).
- Explain intent with comments — the repo contains many well-scoped explanatory comments; preserve or extend them.
- Use `use client` only when necessary in server components (Next.js App Router rule).
- When changing public-facing data shapes, update TypeDoc and add tests for API surface changes.

## Quick file pointers (examples)

- `src/components/TopNavbar/TopNavbar.tsx` — Primary navigation with mega-menu dropdowns (hover + click), mobile drawer.
- `src/contexts/NavbarContext.tsx` — Navigation state (items, dropdown open/close) via React reducer + context.
- `src/components/ui/auth/AuthProvider.tsx` & `AuthButton.tsx` — Clerk auth state and the navbar sign-in / Admin buttons.
- `src/proxy.ts` — Clerk request handling and the www to apex redirect.
- `typedoc.json` + `yarn docs` — docs generation.
- `public/basicBases/Build/` — Unity WebGL assets; treat as static assets.
- `vitest.config.ts` — Test runner config with `@/` alias resolution and jsdom environment.

---

## Top tools for this repo

- Next.js 16, Tailwind CSS v4, Clerk (auth), MongoDB, TypeScript, Vitest, TypeDoc

## Env keys quicklist

Tools degrade gracefully when optional keys are missing (DuckDuckGo works without keys).

## Security posture

- Enforce timeouts and buffer limits for command execution.
