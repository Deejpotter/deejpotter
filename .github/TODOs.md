### C:\Users\deejp\repos\deejpotter\.github\TODOs.md
```markdown
1: 
2: # Security Vulnerability Fix - Detailed Implementation Plan
3: Date: 2026-01-26
4: Owner: @dev
5: Priority: CRITICAL
6: 
7: ---
8: 
9: ## GOAL
10: Fix all 9 security vulnerabilities (1 Critical, 3 High, 5 Moderate) by updating dependencies and applying resolutions.
11: 
12: ---
13: 
14: ## MASTER PLAN OVERVIEW
15: 
16: ### Phase 1: Preparation & Analysis - COMPLETE
17: - Research all vulnerabilities
18: - Document findings
19: - Create implementation plan
20: 
21: ### Phase 2: Package Updates - NEXT
22: - Update package.json dependencies
23: - Add missing resolutions
24: - Validate changes
25: 
26: ### Phase 3: Installation & Verification
27: - Install updated dependencies
28: - Verify resolutions applied
29: - Check for peer dependency conflicts
30: 
31: ### Phase 4: Build & Test
32: - Clean build artifacts
33: - Run full build
34: - Execute test suites
35: - Verify no regressions
36: 
37: ### Phase 5: Security Verification
38: - Re-scan for vulnerabilities
39: - Confirm all alerts resolved
40: - Update documentation
41: 
42: ### Phase 6: Commit & Deploy
43: - Document changes
44: - Commit with proper message
45: - Verify CI/CD passes
46: 
47: ---
48: 
49: ## DETAILED STEP BREAKDOWN
50: 
51: ### STEP 1: Update package.json Dependencies
52: **Logic:** Direct dependencies must be updated manually. Next.js is a direct dependency with 2 high-severity DoS vulnerabilities. We need the latest patch version that includes the security fixes.
53: 
54: **Sub-steps:**
55: 1.1. Read current package.json
56: 1.2. Identify current Next.js version
57: 1.3. Update to latest stable version
58: 1.4. Validate version format
59: 1.5. Write updated package.json
60: 
61: **Success Criteria:**
62: - package.json contains updated Next.js version
63: - File is valid JSON
64: - No unintended changes
65: 
66: ---
67: 
68: ### STEP 2: Add Missing Resolutions
69: **Logic:** Transitive dependencies cannot be updated directly but can be forced via Yarn resolutions field. glob and mdast-util-to-hast are transitive dev dependencies with known vulnerabilities.
70: 
71: **Sub-steps:**
72: 2.1. Read current package.json resolutions
73: 2.2. Add glob resolution
74: 2.3. Add mdast-util-to-hast resolution
75: 2.4. Verify no duplicate entries
76: 2.5. Verify resolution format
77: 2.6. Write updated package.json
78: 
79: **Success Criteria:**
80: - Resolutions contains all required entries
81: - Versions match security requirements
82: - JSON remains valid
83: 
84: ---
85: 
86: ### STEP 3: Validate package.json Syntax
87: **Logic:** Before installing, ensure JSON is syntactically correct to avoid installation errors.
88: 
89: **Sub-steps:**
90: 3.1. Parse package.json as JSON
91: 3.2. Verify all required fields present
92: 3.3. Check resolutions format
93: 3.4. Validate semver ranges
94: 3.5. Report any syntax errors
95: 
96: **Success Criteria:**
97: - JSON parses without errors
98: - All fields properly formatted
99: - Semver ranges valid
100: 
101: ---
102: 
103: ### STEP 4: Install Dependencies
104: **Logic:** Yarn install will read package.json, apply resolutions, and update yarn.lock. This enforces resolutions across the entire dependency tree.
105: 
106: **Sub-steps:**
107: 4.1. Run yarn install
108: 4.2. Capture installation output
109: 4.3. Check for resolution warnings
110: 4.4. Check for peer dependency conflicts
111: 4.5. Verify installation completed
112: 4.6. Save output log
113: 
114: **Success Criteria:**
115: - yarn install exits successfully
116: - No critical errors
117: - yarn.lock updated
118: - node_modules populated
119: 
120: ---
121: 
122: ### STEP 5: Verify Installed Versions
123: **Logic:** Confirm that actual installed versions match our requirements using yarn why.
124: 
125: **Sub-steps:**
126: 5.1. Check next version
127: 5.2. Check glob version
128: 5.3. Check mdast-util-to-hast version
129: 5.4. Check form-data version
130: 5.5. Check js-yaml version
131: 5.6. Check babel runtime version
132: 5.7. Check nanoid version
133: 5.8. Document all versions
134: 
135: **Success Criteria:**
136: - All packages show patched versions
137: - No vulnerable versions in tree
138: - Resolutions properly applied
139: 
140: ---
141: 
142: ### STEP 6: Clean Build Artifacts
143: **Logic:** Next.js caches compiled code. Old cached code may contain transpiled versions of vulnerable dependencies.
144: 
145: **Sub-steps:**
146: 6.1. Check if .next directory exists
147: 6.2. Remove .next directory
148: 6.3. Check for other cache directories
149: 6.4. Remove cache directories
150: 6.5. Verify clean state
151: 
152: **Success Criteria:**
153: - .next directory removed
154: - Cache directories cleared
155: - Clean build environment
156: 
157: ---
158: 
159: ### STEP 7: Run Full Build
160: **Logic:** Building the application transpiles all code and includes dependencies. This reveals any breaking changes.
161: 
162: **Sub-steps:**
163: 7.1. Run yarn build
164: 7.2. Monitor build output
165: 7.3. Check for TypeScript errors
166: 7.4. Check for ESLint errors
167: 7.5. Verify build completes
168: 7.6. Check build output size
169: 7.7. Save build logs
170: 
171: **Success Criteria:**
172: - Build exits successfully
173: - No TypeScript errors
174: - Production bundles generated
175: 
176: ---
177: 
178: ### STEP 8: Run Unit Tests
179: **Logic:** Unit tests verify application logic works with dependency updates.
180: 
181: **Sub-steps:**
182: 8.1. Run yarn test
183: 8.2. Monitor test output
184: 8.3. Check for test failures
185: 8.4. Verify coverage thresholds
186: 8.5. Document any failures
187: 8.6. Save test report
188: 
189: **Success Criteria:**
190: - All tests pass
191: - Coverage meets thresholds
192: - No new test failures
193: 
194: ---
195: 
196: ### STEP 9: Run E2E Tests
197: **Logic:** E2E tests verify end-to-end functionality, especially important for Next.js DoS fixes.
198: 
199: **Sub-steps:**
200: 9.1. Run yarn test:e2e
201: 9.2. Monitor Playwright output
202: 9.3. Check for test failures
203: 9.4. Verify critical user flows
204: 9.5. Check for console errors
205: 9.6. Save screenshots if needed
206: 9.7. Document results
207: 
208: **Success Criteria:**
209: - All E2E tests pass
210: - No browser console errors
211: - Application functions correctly
212: 
213: ---
214: 
215: ### STEP 10: Run Linter
216: **Logic:** Ensure code quality maintained with dependency updates.
217: 
218: **Sub-steps:**
219: 10.1. Run yarn lint
220: 10.2. Check for linting errors
221: 10.3. Verify no new violations
222: 10.4. Run yarn lint:scss
223: 10.5. Document any issues
224: 
225: **Success Criteria:**
226: - No linting errors
227: - Code quality maintained
228: 
229: ---
230: 
231: ### STEP 11: Security Audit Verification
232: **Logic:** Verify vulnerabilities are actually fixed using yarn audit and GitHub Dependabot.
233: 
234: **Sub-steps:**
235: 11.1. Run yarn npm audit
236: 11.2. Parse audit output
237: 11.3. Verify no high/critical vulnerabilities
238: 11.4. Check GitHub Dependabot alerts
239: 11.5. Count remaining open alerts
240: 11.6. Document remaining issues
241: 
242: **Success Criteria:**
243: - yarn audit shows no critical/high issues
244: - All Dependabot alerts resolved
245: - Security posture improved
246: 
247: ---
248: 
249: ### STEP 12: Manual Smoke Test
250: **Logic:** Manual testing verifies the app works for real users.
251: 
252: **Sub-steps:**
253: 12.1. Run yarn dev
254: 12.2. Open browser
255: 12.3. Test homepage loads
256: 12.4. Test navigation
257: 12.5. Test contact form
258: 12.6. Test auth flows
259: 12.7. Check browser console
260: 12.8. Test responsive design
261: 12.9. Document any issues
262: 
263: **Success Criteria:**
264: - App loads without errors
265: - All major features work
266: - Good user experience
267: 
268: ---
269: 
270: ### STEP 13: Update Documentation
271: **Logic:** Document security fixes for audit trail.
272: 
273: **Sub-steps:**
274: 13.1. Read current TODOs.md
275: 13.2. Move security task to Completed
276: 13.3. Add completion date
277: 13.4. Update In Progress section
278: 13.5. Add notes about fixes
279: 13.6. Write updated TODOs.md
280: 13.7. Prepare commit message
281: 
282: **Success Criteria:**
283: - TODOs.md reflects completed work
284: - Clear documentation of fixes
285: 
286: ---
287: 
288: ### STEP 14: Git Commit
289: **Logic:** Atomic commits with clear messages for easy tracking.
290: 
291: **Sub-steps:**
292: 14.1. Run git status
293: 14.2. Review git diff
294: 14.3. Add package.json and yarn.lock
295: 14.4. Add TODOs.md
296: 14.5. Add security-analysis.md
297: 14.6. Commit with message
298: 14.7. Verify commit created
299: 14.8. Review commit
300: 
301: **Success Criteria:**
302: - Clean commit with relevant files
303: - Clear commit message
304: 
305: ---
306: 
307: ### STEP 15: Push & Verify CI
308: **Logic:** CI/CD pipeline must pass to ensure changes work in clean environment.
309: 
310: **Sub-steps:**
311: 15.1. Push to GitHub
312: 15.2. Open GitHub Actions
313: 15.3. Monitor CI pipeline
314: 15.4. Check lint job
315: 15.5. Check test job
316: 15.6. Check build job
317: 15.7. Check e2e job
318: 15.8. Verify Dependabot alerts
319: 15.9. Document CI results
320: 
321: **Success Criteria:**
322: - All CI jobs pass
323: - No new failures
324: - Dependabot alerts reduced
325: 
326: ---
327: 
328: ### STEP 16: Final Verification
329: **Logic:** Verify everything working and clean up.
330: 
331: **Sub-steps:**
332: 16.1. Verify Dependabot count reduced
333: 16.2. Check security-analysis.md updated
334: 16.3. Remove temporary files
335: 16.4. Update README if needed
336: 16.5. Celebrate
337: 
338: **Success Criteria:**
339: - All vulnerabilities resolved
340: - Documentation complete
341: - Repository clean
342: 
343: ---
344: 
345: ## ROLLBACK PLAN
346: 
347: If critical issues found:
348: 1. Revert commit: git revert HEAD
349: 2. Or manual revert package.json
350: 3. Run yarn install
351: 4. Rebuild
352: 5. Document what failed
353: 6. Try incremental approach
354: 
355: ---
356: 
357: ## SUCCESS METRICS
358: 
359: - All 9 vulnerabilities resolved
360: - yarn audit clean
361: - All tests passing
362: - Build successful
363: - CI/CD passing
364: - No breaking changes
365: - Documentation updated
366: 
367: 
368: 
369: ### C:\Users\deejp\repos\deejpotter\.github\TODOs.md
370: ```markdown
371: 1: ### C:\Users\deejp\repos\deejpotter\.github\TODOs.md
372: 2: ```markdown
373: 3: 1: # Project TODOs (.github/TODOs.md)
374: 4: 2: 
375: 5: 3: Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.
376: 6: 4: 
377: 7: 5: Codebase workflow (#codebase)
378: 8: 6: 
379: 9: 7: 1. Read the README first to understand the correct workflow.
380: 10: 8: 2. Use context7 to find exact documentation before making changes.
381: 11: 9: 3. Also, use my-mcp-server's google and duckduckgo search tools to find officical documentation references or search online for information for things that don't have documentation.
382: 12: 10: 4. Keep my current code and comments where possible or add your own detailed comments from my point of view to explain the purpose of the code.
383: 13: 11: 5. Prioritize updating and improving files over creating new ones.
384: 14: 12: Update my current files instead of making new ones and copying them over.
385: 15: 13: 
386: 16: 14: 6. Each project should have a TODOs list under .github/TODOs.md to show the workflow to follow for updates and additions.
387: 17: 15: 
388: 18: 16: 7. First consider how to find the best actions. Then make a detailed plan. Remember this plan and refer back to it regularly to make sure you're on track.Then make the changes following the plan.
389: 19: 17: 
390: 20: 18: Statuses
391: 21: 19: 
392: 22: 20: - Todo — upcoming tasks
393: 23: 21: - In Progress — currently being worked on
394: 24: 22: - Completed — done items (keep only the last 10)
395: 25: 23: 
396: 26: 24: Findings (Audit 2026-01-18)
397: 27: 25: 
398: 28: 26: - Netlify integrations present and working patterns:
399: 29: 27:   - Identity: src/contexts/AuthContext.tsx uses netlify-identity-widget (login/signup/logout handled client-side). Docs: <https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/>
400: 30: 28:   - Forms: Contact form posts to /__forms.html and public/__forms.html exists with the matching hidden form. Docs: <https://docs.netlify.com/manage/forms/setup/> and Next.js note: <https://docs.netlify.com/frameworks/next-js/overview/#netlify-forms-compatibility>
401: 31: 29:   - Functions: netlify/functions/mongoCrud.ts exists and expects MONGODB_URI and DB_NAME. No in-repo callers found for /.netlify/functions/... endpoints yet; likely intended for future mini-apps (e.g., TodoList).
402: 32: 30:   - Netlify config: netlify.toml sets build to yarn build, publish .next, functions.external_node_modules=["mongodb"].
403: 33: 31: - Next.js App Router is used (src/app/*). MDX support is enabled in next.config.js. TypeDoc prebuild generates to public/docs.
404: 34: 32: - Unused or unreferenced deps likely: react-chartjs-2, chart.js, react-dropzone, react-paginate, open-iconic (no usages found in src/). bson-objectid is used (src/types/RepoObject.ts). Gravatar uses md5 and images domain is allowed.
405: 35: 33: - Documentation drift: NextjsRefactor.md still references pages directory and next-auth placeholders that don't reflect current App Router/AuthContext approach.
406: 36: 34: - Quality nits addressed now: fixed README typo (Explain), updated TypeDoc project name and excluded *.test.tsx from docs.
407: 37: 35: 
408: 38: 36: Todo
409: 39: 37: 
410: 40: 38: - Audit repo for Netlify-specific usage: search for `/.netlify/functions/`, `netlify-identity-widget`, `netlify.toml` redirects, and `public/__forms.html`. Document all call sites and update this TODO with findings.
411: 41: 39: - Improve ESLint config (High priority) — implement full Next.js recommended flat config or migrate legacy config properly.
412: 42: 40:   - Owner: @dev
413: 43: 41:   - Acceptance: ESLint runs in CI without TODO fallbacks, includes TypeScript rules, and autofix is applied where safe. (Follow-up PR)
414: 44: 42: - Harden tests and mocks (High priority) — replace ad-hoc zod mocks with safe partial mocks (vi.mock(importOriginal...)) or use real zod where suitable.
415: 45: 43:   - Owner: @dev
416: 46: 44:   - Acceptance: No tests rely on global zod mocks; tests use partial mocks or the real library and pass reliably.
417: 47: 45: - Accessibility audit & fixes (High priority)
418: 48: 46:   - Owner: @dev
419: 49: 47:   - Acceptance: Add automated axe checks (Playwright) for critical pages and fix top accessibility violations (modal focus trap, aria attributes, heading order). Include tests and QA notes in PR.
420: 50: 48: - Metadata & social previews (Medium priority)
421: 51: 49:   - Owner: @dev
422: 52: 50:   - Acceptance: Add OpenGraph/Twitter metadata and canonical URLs for project and blog pages; include a script to auto-generate OG images for posts when possible.
423: 53: 51: - Integration tests for API routes (Medium priority) — add Mongo-backed integration tests via MongoMemoryServer or Testcontainers.
424: 54: 52:   - Owner: @dev
425: 55: 53:   - Acceptance: CI includes an integration job that can run against a test DB; migrations/cleanup documented.
426: 56: 54: - Coverage & reporting (Medium priority) — wire up coverage artifact upload (done) and add Codecov or similar for PR comments & badges.
427: 57: 55:   - Owner: @dev
428: 58: 56:   - Acceptance: Coverage badge added to `README.md`, PR comments show coverage change; CI fails when thresholds are unmet.
429: 59: 57: - Dependabot & security fixes (High priority) — triage GH security alerts and upgrade critical/high packages.
430: 60: 58:   - Owner: @security
431: 61: 59:   - Acceptance: Vulnerabilities closed or a mitigation plan documented in the PRs.
432: 62: 60: - Staging & rollout (Medium priority) — deploy to staging on chosen host, run E2E/integration tests, then deprecate Netlify functions.
433: 63: 61:   - Owner: @dev
434: 64: 62:   - Acceptance: Staging passes E2E tests and rollout checklist is documented.
435: 65: 63: - CI thresholds & gating (Low priority) — enforce Vitest coverage thresholds in CI (already set) and fail PRs when drops occur.
436: 66: 64:   - Owner: @dev
437: 67: 65:   - Acceptance: PRs show status checks for coverage and lint.
438: 68: 66: - Docs & README updates (Low priority) — update docs to reflect auth choice, deployment steps, and variable requirements.
439: 69: 67:   - Owner: @docs
440: 70: 68:   - Acceptance: README and `NextjsRefactor.md` reflect current App Router, auth provider, and deployment steps.
441: 71: 69: - Cleanup unused dependencies (Low priority) — remove unused packages from `package.json` and confirm no breakage.
442: 72: 70:   - Owner: @dev
443: 73: 71:   - Acceptance: After removal, CI passes and lockfile updated.
444: 74: 72: - Remove temporary test patterns (Low priority) — ensure tests don't rely on global side effects or interactive installs.
445: 75: 73:   - Owner: @dev
446: 76: 74:   - Acceptance: Local `yarn test:coverage` runs non-interactively and tests are stable.
447: 77: 75: 
448: 78: 76: - Implement API route handler replacement for mongoCrud ✅
449: 79: 77:   - `src/app/api/mongo-crud/route.ts` added using Next.js Route Handlers (GET/POST/PUT/DELETE).
450: 80: 78:   - Uses a shared MongoClient with connection caching to avoid reconnecting on hot reload.
451: 81: 79:   - Input validation added with `zod` and an environment-based allowlist (`ALLOWED_COLLECTIONS`). ✅
452: 82: 80:   - Server-side auth validation added for mutating operations using Clerk (`auth()` from `@clerk/nextjs`) — POST/PUT/DELETE require authenticated user. ✅
453: 83: 81:   - Unit tests added (Vitest) for validation and auth edge cases. ✅
454: 84: 82: 
455: 85: 83: - Netlify Forms hardening and tests ✅
456: 86: 84:   - Playwright E2E test added to simulate contact form submission against a running dev server (intercepts `/__forms.html` and asserts success UI). ✅
457: 87: 85:   - CI runs Playwright E2E tests against a built site (`.github/workflows/ci.yml` e2e job). ✅
458: 88: 86:   - Confirm `public/__forms.html` stays in sync with UI fields and honeypot name (netlify-honeypot="bot-field"). ✅ (unit test added to assert client POST behavior)
459: 89: 87: 
460: 90: 88: - CI pipeline
461: 91: 89:   - Add a GitHub Actions workflow to run: install, lint, test, TypeDoc, and build on pushes and PRs.
462: 92: 90:   - Upload build output and TypeDoc as artifacts for debugging.
463: 93: 91: 
464: 94: 92: - Dependency audit ✅
465: 95: 93:   - Removed `react-dropzone` and `react-paginate` from `package.json` (no usages in `src/`).
466: 96: 94:   - Remaining likely-unused packages (`react-chartjs-2`, `chart.js`, `open-iconic`) were left in lockfiles but not in `package.json`; plan to remove if truly unused in follow-up PRs.
467: 97: 95:   - Keep `bson-objectid`, `md5`, and MongoDB driver (used).
468: 98: 96: 
469: 99: 97: - Docs & internal guides
470: 100: 98:   - Update `NextjsRefactor.md` to reflect App Router, MDX, AuthContext, and current Netlify integrations; remove pages/* and next-auth references.
471: 101: 99:   - Ensure `readme.md` “Technologies and Tools” reflects the final auth choice after the Auth plan decision.
472: 102: 100:   - Confirm TypeDoc scope: exclude tests (`*.test.tsx` done), ensure only public APIs are documented.
473: 103: 101: 
474: 104: 102: - Config and DX
475: 105: 103:   - Revisit `tsconfig.json` for alignment with Next.js recommendations; consider raising target (ES2020+) and relying on Next’s defaults.
476: 106: 104:   - Ensure ESLint runs type-aware checks; consider adding stricter rules incrementally with autofix.
477: 107: 105:   - Add environment variable documentation and `.env.example` once the hosting/auth plan is finalized (keys: MONGODB_URI, DB_NAME, others).
478: 108: 106: 
479: 109: 107: In Progress
480: 110: 108: 
481: 111: 109: 482: 112: 110: 483: 113: 111: 
484: 114: 112: Completed (last 10)
485: 115: 113: 
486: 116: 114: - Integrate `TopNavbar` into root `layout` and replace Sidebar for desktop nav (2026-01-24)
487: 117: 115: - Update TypeDoc config name and exclude *.test.tsx from docs (2026-01-18)
488: 118: 116: - Fix README typo ("Explain things in comments") (2026-01-18)
489: 119: 117: - Add `src/app/api/mongo-crud/route.ts` and validation unit tests (2026-01-18)
490: 120: 118: - Add GitHub Actions CI workflow for lint/test/docs/build (2026-01-18)
491: 121: 119: - Add `.env.example` and hosting evaluation note `.github/hosting-eval.md` (2026-01-18)
492: 122: 120: - Remove unused client deps and `@netlify/functions` dev dep from `package.json` (2026-01-18)
493: 123: 121: - Add input validation and collection allowlist to API, and add server-side Clerk auth for mutating ops (2026-01-18)
494: 124: 122: - Add Playwright E2E test for contact form (2026-01-18)
495: 125: 123: 
496: 126: 124: Notes
497: 127: 125: 
498: 128: 126: - Do not introduce new dependencies without explicit need.
499: 129: 127: - Use git diffs before/after to verify scope of changes.
500: 130: 128: 
501: 131: 129: ---
502: 132: 130: 
503: 133: 131: ## Recent Update (2026-01-20) ✅
504: 134: 132: 
505: 135: 133: - Build & TypeScript fixes:
506: 136: 134:   - Resolved the blocking TypeScript errors (removed missing `AlgorithmType`, aligned `calculateOptimalCuts` call to `CutCalculatorInput`, fixed `Popover` prop spreads and Vitest coverage config).
507: 137: 135:   - Added a Clerk fallback in `AuthProvider`/`layout` so prerendering won't fail when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing.
508: 138: 136:   - Local production build now completes after these fixes.
509: 139: 137: 
510: 140: 138: - Tailwind migration status:
511: 141: 139:   - Tailwind base and `postcss` config are in place; many unknown `@apply` utilities were replaced with explicit rules to unblock build.
512: 142: 140:   - Per-component SCSS modules remain and are being migrated incrementally (next priority).
513: 143: 141: 
514: ```
```
