# Development — deejpotter.com

> The root `readme.md` is the GitHub profile page (the repo shares the username), so it holds dev profile info only. The repo overview is `docs/README.md`; developer details live here.

How to run, test and change the code. Decisions and the reasons behind them are in `ARCHITECTURE.md`.

## What's where

| Area | Where | Notes |
|---|---|---|
| Home page | `src/components/home`, `src/content/projects.ts` | Project grid is data; motion in `motion.tsx` |
| Outbound links | `src/content/links.ts` | GitHub, LinkedIn, Lumendot. The site has no contact form |
| Write-ups | `src/content/blog-md`, `src/content/blog`, `src/app/blog` | Markdown or page components, RSS at `/blog/rss.xml`. URLs stay under `/blog/` |
| Projects, tools and games | `src/app/projects`, `public/basicBases`, `public/geek-pride-day` | Tools run in the browser |
| Old URL redirects | `public/_redirects` | Read by the static host, not by Next.js |

## Setup

Requires **Node 24** (`.nvmrc`, `engines`) and **Yarn 1**. The lockfile is Yarn classic, so don't run `yarn set version` and don't use npm alongside it.

```bash
yarn install
yarn dev               # http://localhost:3000
```

No environment variables are needed. `.env.example` lists the one optional variable.

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Development server |
| `yarn build` | Static export into `out/` |
| `yarn test` | Vitest |
| `yarn lint` / `yarn lint:scss` | ESLint / Stylelint |
| `yarn test:e2e` | Playwright (local only, not in CI) |
| `yarn docs` | TypeDoc into `public/docs` |

To look at the built site, serve `out/` with any static server, for example `python -m http.server 4321` from inside `out/`. `yarn start` does not work with a static export. `_redirects` only takes effect on the static host.

CI (`.github/workflows`) runs lint, Stylelint, Vitest and the build on pushes and PRs.

## Deploys

Until the switch in `PERSONAL_SITE_PLAN.md`, Render still deploys the old business app from `dev` (staging) and `main` (production). The static site lives on `feat/personal-site` and must not be merged into `dev` or `main` before lumendot.com has the quote flow.

## Conventions

- **Comments explain why.** Each module and non-obvious block says what problem it solves or which rule it enforces, not what the lines do.
- **Static only:** no API routes, request-time data, cookies or server actions; they break the export (`ARCHITECTURE.md`, "Static export").
- **Tests with changes:** new behaviour and bug fixes come with Vitest tests.
- **Branches:** work on a branch, PR into `dev`, then `dev` into `main`. Conventional commit messages.
- **Docs:** if you change a framework or workflow, update this file, `ARCHITECTURE.md`, `.github/copilot-instructions.md` and `.github/TODOs.md`.
- **External claims in docs** are cited in APA 7 with a References section, and each source is checked to say what's cited.

## Other docs

- `ARCHITECTURE.md`: decisions and why
- `PERSONAL_SITE_PLAN.md`: what the site is for and the order of the switch-over
- `.github/TODOs.md`: current work and follow-ups
