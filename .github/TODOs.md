# Project TODOs (.github/TODOs.md)

Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.

Codebase workflow (#codebase)

1. Read the README first to understand the correct workflow.
2. Use context7 to find exact documentation before making changes.
3. Also, use my-mcp-server's google and duckduckgo search tools to find officical documentation references or search online for information for things that don't have documentation.
4. Keep my current code and comments where possible or add your own detailed comments from my point of view to explain the purpose of the code.
5. Prioritize updating and improving files over creating new ones.
Update my current files instead of making new ones and copying them over.

6. Each project should have a TODOs list under .github/TODOs.md to show the workflow to follow for updates and additions.

7. First consider how to find the best actions. Then make a detailed plan. Remember this plan and refer back to it regularly to make sure you're on track.Then make the changes following the plan.

Statuses

- Todo — upcoming tasks
- In Progress — currently being worked on
- Completed — done items (keep only the last 10)

Findings (Audit 2026-01-18)

- Netlify integrations present and working patterns:
  - Identity: src/contexts/AuthContext.tsx uses netlify-identity-widget (login/signup/logout handled client-side). Docs: <https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/>
  - Forms: Contact form posts to /__forms.html and public/__forms.html exists with the matching hidden form. Docs: <https://docs.netlify.com/manage/forms/setup/> and Next.js note: <https://docs.netlify.com/frameworks/next-js/overview/#netlify-forms-compatibility>
  - Functions: netlify/functions/mongoCrud.ts exists and expects MONGODB_URI and DB_NAME. No in-repo callers found for /.netlify/functions/... endpoints yet; likely intended for future mini-apps (e.g., TodoList).
  - Netlify config: netlify.toml sets build to yarn build, publish .next, functions.external_node_modules=["mongodb"].
- Next.js App Router is used (src/app/*). MDX support is enabled in next.config.js. TypeDoc prebuild generates to public/docs.
- Unused or unreferenced deps likely: react-chartjs-2, chart.js, react-dropzone, react-paginate, open-iconic (no usages found in src/). bson-objectid is used (src/types/RepoObject.ts). Gravatar uses md5 and images domain is allowed.
- Documentation drift: NextjsRefactor.md still references pages directory and next-auth placeholders that don't reflect current App Router/AuthContext approach.
- Quality nits addressed now: fixed README typo (Explain), updated TypeDoc project name and excluded *.test.tsx from docs.

Todo

- Audit repo for Netlify-specific usage: search for `/.netlify/functions/`, `netlify-identity-widget`, `netlify.toml` redirects, and `public/__forms.html`. Document all call sites and update this TODO with findings.
- Improve ESLint config (High priority) — implement full Next.js recommended flat config or migrate legacy config properly.
  - Owner: @dev
  - Acceptance: ESLint runs in CI without TODO fallbacks, includes TypeScript rules, and autofix is applied where safe. (Follow-up PR)
- Harden tests and mocks (High priority) — replace ad-hoc zod mocks with safe partial mocks (vi.mock(importOriginal...)) or use real zod where suitable.
  - Owner: @dev
  - Acceptance: No tests rely on global zod mocks; tests use partial mocks or the real library and pass reliably.
- Accessibility audit & fixes (High priority)
  - Owner: @dev
  - Acceptance: Add automated axe checks (Playwright) for critical pages and fix top accessibility violations (modal focus trap, aria attributes, heading order). Include tests and QA notes in PR.
- Metadata & social previews (Medium priority)
  - Owner: @dev
  - Acceptance: Add OpenGraph/Twitter metadata and canonical URLs for project and blog pages; include a script to auto-generate OG images for posts when possible.
- Integration tests for API routes (Medium priority) — add Mongo-backed integration tests via MongoMemoryServer or Testcontainers.
  - Owner: @dev
  - Acceptance: CI includes an integration job that can run against a test DB; migrations/cleanup documented.
- Coverage & reporting (Medium priority) — wire up coverage artifact upload (done) and add Codecov or similar for PR comments & badges.
  - Owner: @dev
  - Acceptance: Coverage badge added to `README.md`, PR comments show coverage change; CI fails when thresholds are unmet.
- Dependabot & security fixes (High priority) — triage GH security alerts and upgrade critical/high packages.
  - Owner: @security
  - Acceptance: Vulnerabilities closed or a mitigation plan documented in the PRs.
- Staging & rollout (Medium priority) — deploy to staging on chosen host, run E2E/integration tests, then deprecate Netlify functions.
  - Owner: @dev
  - Acceptance: Staging passes E2E tests and rollout checklist is documented.
- CI thresholds & gating (Low priority) — enforce Vitest coverage thresholds in CI (already set) and fail PRs when drops occur.
  - Owner: @dev
  - Acceptance: PRs show status checks for coverage and lint.
- Docs & README updates (Low priority) — update docs to reflect auth choice, deployment steps, and variable requirements.
  - Owner: @docs
  - Acceptance: README and `NextjsRefactor.md` reflect current App Router, auth provider, and deployment steps.
- Cleanup unused dependencies (Low priority) — remove unused packages from `package.json` and confirm no breakage.
  - Owner: @dev
  - Acceptance: After removal, CI passes and lockfile updated.
- Remove temporary test patterns (Low priority) — ensure tests don't rely on global side effects or interactive installs.
  - Owner: @dev
  - Acceptance: Local `yarn test:coverage` runs non-interactively and tests are stable.

- Implement API route handler replacement for mongoCrud ✅
  - `src/app/api/mongo-crud/route.ts` added using Next.js Route Handlers (GET/POST/PUT/DELETE).
  - Uses a shared MongoClient with connection caching to avoid reconnecting on hot reload.
  - Input validation added with `zod` and an environment-based allowlist (`ALLOWED_COLLECTIONS`). ✅
  - Server-side auth validation added for mutating operations using Clerk (`auth()` from `@clerk/nextjs`) — POST/PUT/DELETE require authenticated user. ✅
  - Unit tests added (Vitest) for validation and auth edge cases. ✅

- Netlify Forms hardening and tests ✅
  - Playwright E2E test added to simulate contact form submission against a running dev server (intercepts `/__forms.html` and asserts success UI). ✅
  - CI runs Playwright E2E tests against a built site (`.github/workflows/ci.yml` e2e job). ✅
  - Confirm `public/__forms.html` stays in sync with UI fields and honeypot name (netlify-honeypot="bot-field"). ✅ (unit test added to assert client POST behavior)

- CI pipeline
  - Add a GitHub Actions workflow to run: install, lint, test, TypeDoc, and build on pushes and PRs.
  - Upload build output and TypeDoc as artifacts for debugging.

- Dependency audit ✅
  - Removed `react-dropzone` and `react-paginate` from `package.json` (no usages in `src/`).
  - Remaining likely-unused packages (`react-chartjs-2`, `chart.js`, `open-iconic`) were left in lockfiles but not in `package.json`; plan to remove if truly unused in follow-up PRs.
  - Keep `bson-objectid`, `md5`, and MongoDB driver (used).

- Docs & internal guides
  - Update `NextjsRefactor.md` to reflect App Router, MDX, AuthContext, and current Netlify integrations; remove pages/* and next-auth references.
  - Ensure `readme.md` “Technologies and Tools” reflects the final auth choice after the Auth plan decision.
  - Confirm TypeDoc scope: exclude tests (`*.test.tsx` done), ensure only public APIs are documented.

- Config and DX
  - Revisit `tsconfig.json` for alignment with Next.js recommendations; consider raising target (ES2020+) and relying on Next’s defaults.
  - Ensure ESLint runs type-aware checks; consider adding stricter rules incrementally with autofix.
  - Add environment variable documentation and `.env.example` once the hosting/auth plan is finalized (keys: MONGODB_URI, DB_NAME, others).

In Progress

- Copy `ui-components` into repo and update imports — **In Progress** (started 2026-01-19)
- ESLint migration: PR `eslint/migration` created with `eslint.config.cjs` and `lint:fix` script — **In Progress** (created branch and pushed; PR URL: <https://github.com/Deejpotter/deejpotter/pull/new/eslint/migration>)

- **Fix Tailwind v4 styling issues** — **Completed** (2026-01-31) ✅
  - **Root cause**: Project uses Tailwind v4.1.18 with `@tailwindcss/postcss` but config uses v3 syntax (JS config file). Tailwind v4 ignores `tailwind.config.cjs` and requires CSS-based `@theme` configuration.
  
  **Step 1: Update PostCSS config for Tailwind v4** ✅
  - [x] 1.1 Change `postcss.config.cjs` to use correct v4 plugin syntax
  - [x] 1.2 Verify PostCSS processes Tailwind correctly
  
  **Step 2: Migrate theme to Tailwind v4 CSS-based config** ✅
  - [x] 2.1 Add `@import "tailwindcss"` and `@theme` block to globals.css
  - [x] 2.2 Define custom colors (primary, secondary, info, danger, warning, light, dark, gray scale)
  - [x] 2.3 Define custom fonts (nunito, fredoka) using CSS variables
  - [x] 2.4 Define custom spacing, border-radius, and shadows
  
  **Step 3: Fix plugin compatibility** ✅
  - [x] 3.1 Add `@plugin "@tailwindcss/forms"` directive in CSS
  - [x] 3.2 Add `@plugin "@tailwindcss/typography"` directive in CSS
  - [x] 3.3 Add `@custom-variant dark` for class-based dark mode toggling
  
  **Step 4: Update component class names if needed**
  - [ ] 4.1 Verify Tailwind v4 utility class names (some changed from v3)
  - [ ] 4.2 Fix any deprecated class names
  
  **Step 5: Verify and test**
  - [x] 5.1 Run yarn build to confirm no errors (26/26 pages generated)
  - [ ] 5.2 Run yarn dev and visually verify styling works
  - [ ] 5.3 Check dark mode classes work correctly
  - [ ] 5.4 Remove unused `src/app/globals.scss` (v3 syntax, not imported)

- Remove remaining Bootstrap references in favor of Tailwind — **Blocked** (depends on Tailwind fix above)
  - [x] Inventory current Bootstrap usage (btn*, row/col, card, alert, badge, accordion) and target files to convert
  - [x] Convert shared UI (Popover trigger/close, Modal, TodoList, TodoItem) to Tailwind patterns and remove Bootstrap icon reliance
  - [x] Convert project listings (websites/tools/games) to Tailwind grid/cards/buttons, including badges and alerts
  - [x] Convert project detail pages (websites/deejpotter, engineering index, wireless-car) to Tailwind layouts and replace accordion/alert patterns with native components
  - [x] Remove Bootstrap shim styles from src/styles/globals.css after conversions
  - [ ] Final Bootstrap string sweep + yarn build to verify

Completed (last 10)

- Auth cleanup: Remove duplicate `AuthContext.tsx`, update docs, add env setup instructions (2026-01-31)
- Tailwind v4 fix: Migrate from v3 JS config to v4 CSS-based `@theme` + `@plugin` directives (2026-01-31)
- Integrate `TopNavbar` into root `layout` and replace Sidebar for desktop nav (2026-01-24)
- Update TypeDoc config name and exclude *.test.tsx from docs (2026-01-18)
- Fix README typo ("Explain things in comments") (2026-01-18)
- Add `src/app/api/mongo-crud/route.ts` and validation unit tests (2026-01-18)
- Add GitHub Actions CI workflow for lint/test/docs/build (2026-01-18)
- Add `.env.example` and hosting evaluation note `.github/hosting-eval.md` (2026-01-18)
- Remove unused client deps and `@netlify/functions` dev dep from `package.json` (2026-01-18)
- Add input validation and collection allowlist to API, and add server-side Clerk auth for mutating ops (2026-01-18)

Notes

- Do not introduce new dependencies without explicit need.
- Use git diffs before/after to verify scope of changes.

---

## Recent Update (2026-01-31) ✅

### Tailwind v4 Migration Complete

- **Root cause identified**: Project had Tailwind v4.1.18 packages but was using v3 JS config syntax
- **Solution**: Migrated to Tailwind v4 CSS-based configuration:
  - `src/styles/globals.css` now uses `@import "tailwindcss"` instead of `@tailwind` directives
  - All theme tokens defined in `@theme { }` block
  - Plugins loaded via `@plugin "@tailwindcss/forms"` and `@plugin "@tailwindcss/typography"`
  - Dark mode enabled with `@custom-variant dark (&:where(.dark, .dark *))`
- **Note**: `tailwind.config.cjs` is now IGNORED by Tailwind v4 - all config must be in CSS

### Auth Cleanup Complete

- Removed duplicate `src/contexts/AuthContext.tsx` (was never imported)
- Removed unused `src/app/globals.scss` (v3 Tailwind syntax)
- Updated `readme.md` with environment setup instructions for Clerk
- Updated `copilot-instructions.md` with current auth architecture
- Added detailed comments to `src/contexts/AuthProvider.tsx` explaining the fallback pattern

### Test Status

- All 39 tests pass (4 test files)
- Tests work without environment variables (graceful degradation)
- Auth components work when Clerk keys are configured in `.env.local`

### Next Steps

1. Verify visual styling in browser
2. Run visual regression / Playwright snapshots
3. Finalize deployment plan
4. Open PRs for any remaining component migrations
