# Copilot & AI Agent Instructions for deejpotter Repository

## Project Overview

This is a Next.js portfolio site (see `readme.md`). It's a static-first app with dynamic pieces powered by Netlify:

- App code and routes: `src/app` (Next.js App Router).
- UI components: `src/components` and `src/templates` (reusable sections like `BasicSection` and `GradientHeroSection`).
- Auth and client state: `src/contexts` (notably `AuthContext.tsx` which uses `netlify-identity-widget`).
- Serverless backend: `netlify/functions` (e.g. `mongoCrud.ts` talking to MongoDB; env vars `MONGODB_URI` and `DB_NAME` required).
- Static assets and games: `public/` (Unity WebGL in `public/basicBases/Build/`).
- Docs: TypeDoc output goes to `public/docs` (`typedoc.json` and `npm run docs` / `yarn docs`).

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

- Pages live in `src/app/*`; components are kept in `src/components/*` and global styles in `src/styles/*.scss`.
- MDX content support exists (`@next/mdx`, `src/lib/mdx.ts`) — prefer existing MDX utils when adding content-driven pages.
- Tests use Jest + React Testing Library + `jest-axe`. See `jest.config.js` and `jest.setup.js`.
- Alias imports use `@/` mapped to `src/` (jest mapping in `jest.config.js`).
- CSS and theme overrides: `src/styles/bootstrap-overrides.scss` and `dark-bootstrap-overrides.scss` — follow the existing variables and class names.

## Developer Workflows (must-know commands)

- Local dev: `npm run dev` (or `yarn dev`) — Next.js dev server.
- Build (CI / production): `npm run build` — runs `prebuild` (TypeDoc) then `next build`.
- Run tests: `npm test` (Jest).
- Lint: `npm run lint`.
- Docs: `npm run docs` (writes to `public/docs`).
- CI: A GitHub Actions workflow runs lint, tests, docs and build on pushes and PRs (`.github/workflows/ci.yml`).
- Env: example env vars are in `.env.example` (MONGODB_URI, DB_NAME).

Tip: Netlify development (functions and identity) may require the Netlify CLI (`netlify dev`) to fully emulate production functions and Identity flows.

⚠️ Migration note: The repo is migrating away from Netlify functions and (optionally) Netlify Identity — see `.github/TODOs.md` and `.github/hosting-eval.md` for the migration plan and hosting recommendations (Vercel/Render/Coolify). When adding server endpoints prefer `src/app/api/*/route.ts` route handlers for portability.

## Integration Points & Environment

- Netlify hosting — see `netlify.toml` for build and function settings (external_node_modules includes `mongodb`). Note: the project is migrating away from Netlify; see `.github/hosting-eval.md` and `.github/TODOs.md` for details.
- Netlify Identity: used in `src/contexts/AuthContext.tsx` via `netlify-identity-widget` (login/signup/logout handled in the client). Decide whether to keep that service externally or migrate to a provider of your choice.
- Netlify Forms: contact form is wired through the site (see contact page in `src/app/contact` and `public/__forms.html`). If leaving Netlify, replace form handling with Next.js route handlers.
- Serverless functions: `netlify/functions/mongoCrud.ts` has been replaced by `src/app/api/mongo-crud/route.ts` which uses Next.js Route Handlers and environment variables `MONGODB_URI` and `DB_NAME`.
- Local env example: see `.env.example` for required environment variables to run local dev and deploy to new hosts.

## Project-Specific Conventions

- Prefer `type` declarations and keep exported types in `src/types/*` (see `Project.ts`, `RepoObject.ts`).
- Explain intent with comments — the repo contains many well-scoped explanatory comments; preserve or extend them.
- Use `use client` only when necessary in server components (Next.js App Router rule).
- When changing public-facing data shapes, update TypeDoc and add tests for API surface changes.

## Quick file pointers (examples)

- `netlify/functions/mongoCrud.ts` — example function, Mongo usage, and error handling.
- `src/contexts/AuthContext.tsx` — Netlify Identity login flows.
- `src/app/contact/page.tsx` & `public/__forms.html` — Netlify Forms integration.
- `typedoc.json` + `package.json#scripts` — docs generation and prebuild hook.
- `public/basicBases/Build/` — Unity WebGL assets; treat as static assets.

---

## Top tools for this repo

- Next.js, Netlify (hosting + functions + identity), MongoDB, TypeScript, Jest, TypeDoc



## Env keys quicklist

Tools degrade gracefully when optional keys are missing (DuckDuckGo works without keys).

## Security posture

- Enforce timeouts and buffer limits for command execution.
