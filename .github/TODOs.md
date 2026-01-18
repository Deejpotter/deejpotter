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
- Prototype migration: convert `netlify/functions/mongoCrud.ts` → `src/app/api/mongo-crud/route.ts` (Next.js route handler), add Jest tests that mirror current behavior, and update TypeDoc output. ✅ (route + validation unit tests added)
- Evaluate hosting options (Coolify, Render, Vercel): document tradeoffs, required environment variables, and deployment steps for each. ✅ (see `.github/hosting-eval.md`)
- Auth plan: decide whether to keep Netlify Identity as an external service or migrate to Auth0/Clerk/Supabase; list necessary code changes and tests. ✅ (Clerk chosen and integrated on `dev` branch; see `src/contexts/AuthContext.tsx`, `middleware.ts`, and `.env.local.example`)
- CI/CD & config work: update/remove `netlify.toml`, ensure `yarn build`/`prebuild` still valid, and prepare deployment scripts for chosen host. ⚠️ (CI workflow added; netlify.toml still present until full migration)
- Dependencies & cleanup: identify Netlify-specific packages (e.g., `@netlify/functions`, `netlify-identity-widget` if replaced) and plan safe removal after rollout. ✅ (unused dependencies removed from `package.json`; keep `netlify-identity-widget` until auth plan)
- Staging & rollout tasks: deploy to staging on the chosen host, run E2E/integration tests, then deprecate `netlify/functions/*` and remove leftover config. 🔲 (pending)

- Implement API route handler replacement for mongoCrud ✅
	- `src/app/api/mongo-crud/route.ts` added using Next.js Route Handlers (GET/POST/PUT/DELETE).
	- Uses a shared MongoClient with connection caching to avoid reconnecting on hot reload.
	- Input validation added with `zod` and an environment-based allowlist (`ALLOWED_COLLECTIONS`). ✅
	- Server-side auth validation added for mutating operations using Clerk (`auth()` from `@clerk/nextjs`) — POST/PUT/DELETE require authenticated user. ✅
	- Unit tests added (Vitest) for validation and auth edge cases. ✅

- Netlify Forms hardening and tests ✅
	- Playwright E2E test added to simulate contact form submission against a running dev server (intercepts `/__forms.html` and asserts success UI). ✅
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

- (none)

Completed (last 10)

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
