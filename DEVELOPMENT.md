# Development — deejpotter.com

> The root `readme.md` is the GitHub profile page (the repo shares the username), so it holds dev profile info only. The repo overview is `docs/README.md`; developer details live here.

How to run, test and change the code. Decisions and the reasons behind them are in `ARCHITECTURE.md`.

## What's where

| Area | Where | Notes |
|---|---|---|
| 3D printing quotes and orders | `src/app/projects/services/3d-printing`, `src/lib/quote-*.ts` | Live price from the STL, Australia Post delivery prices, Stripe Payment Links, automatic order statuses and emails ("Quote to order flow" in `ARCHITECTURE.md`) |
| Admin | `src/app/admin` | Quote board, contact leads, settings (materials, prices, shipping). Only Clerk user IDs in `ADMIN_USER_IDS` get in |
| Contact form | `src/app/contact`, `src/app/api/contact` | Saves messages to MongoDB; shown at `/admin/leads` |
| Blog | `src/content/blog-md`, `src/content/blog` | Hand-written Markdown or page components, RSS at `/blog/rss.xml` |
| Projects and tools | `src/app/projects` | Portfolio pages and small tools |
| Groceries | `src/app/groceries` | A small personal tool |

## Setup

Requires **Node 24** (`.nvmrc`, `engines`) and **Yarn 1**. The lockfile is Yarn classic, so don't run `yarn set version` and don't use npm alongside it.

```bash
yarn install
cp .env.example .env   # fill in the values
yarn dev               # http://localhost:3000
```

`.env.example` explains every variable. The full table, including which are required on Render, is in `ARCHITECTURE.md` ("Environment Variables"). Payment and shipping keys: `PAYMENTS_SETUP.md`. File storage: `R2_SETUP.md`.

## Local database

Local development uses its own database, `deejpotter_dev`, on the same Atlas cluster as the site (production uses `deejpotter`, staging `deejpotter_staging`). Keep `DB_NAME=deejpotter_dev` in `.env` so local work never touches the site's data. `next dev`, `next build` and the tests all read it.

To refresh the dev database from the site's data with the MongoDB Shell (`winget install MongoDB.Shell`):

```js
// refresh-dev-db.js: run with  mongosh "<MONGODB_URI>" --file refresh-dev-db.js
const src = db.getSiblingDB("deejpotter");
const dev = db.getSiblingDB("deejpotter_dev");
for (const name of src.getCollectionNames()) {
  const docs = src.getCollection(name).find().toArray();
  dev.getCollection(name).drop();
  if (docs.length) dev.getCollection(name).insertMany(docs);
}
```

Once the site has real customers, copy only the non-personal collections (`service_configs`, `settings`).

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Development server |
| `yarn build` / `yarn start` | Production build / serve it |
| `yarn test` | Vitest (some API tests start an in-memory MongoDB, which downloads a binary on first run) |
| `yarn lint` / `yarn lint:scss` | ESLint / Stylelint |
| `yarn test:e2e` | Playwright (local only, not in CI) |
| `yarn docs` | TypeDoc into `public/docs` |

CI (`.github/workflows`) runs lint, Stylelint, Vitest and the build on pushes and PRs.

## Deploys

Render runs the site as a Node server (`yarn build`, then `yarn start`). `dev` deploys to staging.deejpotter.com and `main` to deejpotter.com. Check design and content changes on staging before merging to `main`.

## Conventions

- **Comments explain why.** Each module and non-obvious block says what problem it solves or which rule it enforces, not what the lines do.
- **Rendering:** pages are static by default; use ISR only when a public page reads MongoDB ("Rendering and caching" in `ARCHITECTURE.md`).
- **Tests with changes:** new behaviour and bug fixes come with Vitest tests.
- **Branches:** work on a branch, PR into `dev` (staging), then `dev` into `main` (production). Conventional commit messages.
- **Docs:** if you change a framework or workflow (testing, UI, hosting), update this file, `ARCHITECTURE.md`, `.github/copilot-instructions.md` and `.github/TODOs.md`.
- **External claims in docs** are cited in APA 7 with a References section, and each source is checked to say what's cited.

## Other docs

- `ARCHITECTURE.md`: decisions and why (hosting, databases, rendering, order flow, pricing, shipping, env vars)
- `.github/TODOs.md`: current work and follow-ups
- `.github/ISSUES/`: larger plans
- `.github/copilot-instructions.md`: conventions for AI assistants
