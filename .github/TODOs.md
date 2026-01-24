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
	- Identity: src/contexts/AuthContext.tsx uses netlify-identity-widget (login/signup/logout handled client-side). Docs: https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/
	- Forms: Contact form posts to /__forms.html and public/__forms.html exists with the matching hidden form. Docs: https://docs.netlify.com/manage/forms/setup/ and Next.js note: https://docs.netlify.com/frameworks/next-js/overview/#netlify-forms-compatibility
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
- ESLint migration: PR `eslint/migration` created with `eslint.config.cjs` and `lint:fix` script — **In Progress** (created branch and pushed; PR URL: https://github.com/Deejpotter/deejpotter/pull/new/eslint/migration)
- Migrate SCSS to modern `@use` / `@forward` and fix Sass deprecation warnings — **In Progress** (started 2026-01-24)
- Replace deprecated `map-merge` with `sass:map` `map.merge` (2026-01-24) ✅

Completed (last 10)

- Restore Bootstrap SCSS import and apply `$primary` override (2026-01-24)
- Replace `info` color class uses with `primary` to favor green accent (2026-01-24)
- Update TypeDoc config name and exclude *.test.tsx from docs (2026-01-18)
- Fix README typo ("Explain things in comments") (2026-01-18)
- Add `src/app/api/mongo-crud/route.ts` and validation unit tests (2026-01-18)
- Add GitHub Actions CI workflow for lint/test/docs/build (2026-01-18)
- Add `.env.example` and hosting evaluation note `.github/hosting-eval.md` (2026-01-18)
- Remove unused client deps and `@netlify/functions` dev dep from `package.json` (2026-01-18)
- Add input validation and collection allowlist to API, and add server-side Clerk auth for mutating ops (2026-01-18)
- Add Playwright E2E test for contact form (2026-01-18)


Notes

- Do not introduce new dependencies without explicit need.
- Use git diffs before/after to verify scope of changes.

---

## Recent Update (2026-01-20) ✅

- Build & TypeScript fixes:
  - Resolved the blocking TypeScript errors (removed missing `AlgorithmType`, aligned `calculateOptimalCuts` call to `CutCalculatorInput`, fixed `Popover` prop spreads and Vitest coverage config).
  - Added a Clerk fallback in `AuthProvider`/`layout` so prerendering won't fail when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing.
  - Local production build now completes after these fixes.

- Tailwind migration status:
  - Tailwind base and `postcss` config are in place; many unknown `@apply` utilities were replaced with explicit rules to unblock build.
  - Per-component SCSS modules remain and are being migrated incrementally (next priority).

- Cleanup performed (2026-01-20):
  - Removed generated agent and prompt markdowns and one obsolete issue that were imported for Next.js/MCP experiments: `.github/prompts/*`, `.github/agents/*`, `.github/ISSUES/007-tailwind-migration.md`.

- Next steps (priority):
  1. Finish per-component SCSS → Tailwind conversions and remove legacy SCSS imports. 🔧
  2. Run visual regression / Playwright snapshots to confirm parity. 🧪
  3. Finalize deployment plan & remove remaining Netlify-specific artifacts once ready. 🚀
  4. Confirm CI (lint/tests/a11y/e2e) passes and open PRs for incremental migrations.

> If you'd like, I can also remove related dev dependencies that were specifically added for MCP experiments — I didn't find new package additions tied to those markdowns, so nothing required there unless you want to prune additional unused packages.

