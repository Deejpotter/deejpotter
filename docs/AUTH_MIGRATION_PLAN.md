# Better Auth migration plan — deejpotter.com

**Status:** Phase 0 done, 2026-09-30 (see [Phase 0 results](#phase-0-results-2026-09-30)). Next is phase 1, which only moves code behind one helper and changes no behaviour. The switch to Better Auth (phases 4 and 5) still waits for the Day Planner's cut-over. No production code has changed.
**Goal:** deejpotter.com owns its users and sessions in its own MongoDB through Better Auth, and stops depending on Clerk's SDK. People sign in with email and password or with Google. Clerk stays only as the shared sign-in hub for Deej's apps, connected as an optional "Sign in with Clerk" (OpenID Connect) provider, the same way the Day Planner does it.

This follows the Day Planner's plan (`Deejpotter/day-planner`, `docs/AUTH-SELF-HOSTING-PLAN.md`) and reuses its decisions and findings. Only the differences are argued here.

## 1. What carries over from the Day Planner

| Decision or finding | Why it applies here too |
|---|---|
| Better Auth switches on per deployment when `BETTER_AUTH_SECRET` is set | Staging can run Better Auth while production stays on Clerk, from the same code |
| Few plugins: here only Generic OAuth and `nextCookies`, plus the built-in email and password and Google providers | Fewer plugins means fewer advisories to track. This site needs no API keys, SSO, SCIM or organisations, and not the admin plugin either (see section 2, Admin) |
| Clerk connected through Generic OAuth, **never** in `trustedProviders` | An OIDC sign-in links to an existing user only when Clerk reports the email as verified *and* the local user is verified (Day Planner phase 0 finding 1) |
| Callback path is `/api/auth/callback/{providerId}` | Better Auth 1.7 registers Generic OAuth providers as social providers (Day Planner finding 6) |
| A Clerk **development** instance can't act as the OIDC provider in a browser | Staging needs an OAuth app on the Clerk **production** instance, with the staging redirect URI (Day Planner finding 7) |
| Stricter rate limits on sign-in, sign-up and password reset; memory storage | Each Render service runs one instance |
| Trusted origins built from `BETTER_AUTH_URL` plus optional `TRUSTED_ORIGINS` | Staging and production each trust only their own origin |

## 2. What's different here

| | Day Planner | deejpotter.com | Consequence |
|---|---|---|---|
| Database | Postgres with Prisma | MongoDB, native driver (`src/lib/db.ts`) | Use `mongodbAdapter`. MongoDB needs no schema generation or migration, and passing the `MongoClient` enables transactions ([Better Auth, n.d.](#ref-ba-mongo)). The spike settled the rest: Better Auth reuses the existing `users` collection with ObjectId ids (see [Phase 0 results](#phase-0-results-2026-09-30)) |
| Host | Coolify (Docker) | Render (Node) | No image or entrypoint work; env vars set through the Render API |
| Email | Optional SMTP | Resend already configured | Password reset and email verification work from the start |
| Self-hosting | Setup wizard, API keys, public docs site | Not needed | Skip Day Planner phases 4, 6 and 7 and the API-key plugin |
| Admin | `role` column from the admin plugin | `ADMIN_USER_IDS` env var of Clerk ids | Becomes `ADMIN_EMAILS`, matched only against a **verified** email. This keeps the rule in `src/lib/admin-auth.ts` that only the server environment can grant admin. The admin plugin isn't used: it would add its own `role` field (default `user`) on top of the existing `role` (`customer`), and its ban and user-list features aren't needed |
| Customer data | Tasks owned by user id | Quotes found by **email** (`/account` lists by `userEmail`) | Order history carries over without re-linking; `quotes.userId` (a Clerk id) is kept only for reference |
| Clerk usage | Behind one `getAuthContext()` | `auth()` / `currentUser()` called directly in 11 files, 19 import Clerk | Put one helper in front of Clerk **before** switching (phase 1), so the switch touches one file |

## 3. Plan

Each phase ends with type-check, lint, tests and build passing, lands on `dev`, and is checked on staging before any `dev` → `main` PR.

### Phase 0: Prepare (about 2 hours)
**Why:** test the one real unknown, MongoDB, before any code depends on it.
- 0.1 Back up the production and staging databases (`mongodump`) and test a restore into a scratch database. A backup that's never been restored doesn't count.
- 0.2 Wait for the Day Planner cut-over and note anything its phase 8 changed.
- 0.3 Spike on a throwaway branch against a restored copy:
  - Better Auth with `mongodbAdapter(db, { client })`, on Next 16
  - whether Better Auth can own the existing `users` collection (field mapping, ISO-string dates, `clerkId`) or needs its own `user` collection; record the choice here
  - how ids are stored (ObjectId or string), because quotes store user ids
  - account linking against a mock OIDC provider, repeating Day Planner scenarios A–D
- 0.4 Decide whether customers get Google sign-in as well as email and password.

#### Phase 0 results (2026-09-30)

| Step | Result |
|---|---|
| 0.1 Backup | Done. `mongodump` isn't installed, so a script using the repo's MongoDB driver saved every collection of `deejpotter` and `deejpotter_staging` as canonical Extended JSON (keeps ObjectId and date types) with its index definitions, to `~/backups/deejpotter/<db>-20260929T222002Z/` on Deej's PC, outside the repo. **Restore tested:** each backup was loaded into a throwaway local MongoDB; every collection's document count and content hash matched the source. Nothing was written to Atlas. The backups hold customer names and emails, and so far exist only on that PC. |
| 0.2 Day Planner | Not cut over yet: phases 1–6 are on its `dev`, and `main` still runs Clerk. This doesn't block phases 1–3 here, which change no behaviour on production. Phases 4 and 5 wait for it. |
| 0.3 Spike | Done on branch `spike/better-auth` (not for merge), `scripts/spike/better-auth-mongo.mjs`. Better Auth 1.7.6 (the latest release) with `mongodbAdapter(db, { client })` on a local replica set restored from the production backup, with a mock OIDC provider standing in for Clerk. All checks passed after one fix (finding 1). A route at `/api/auth/[...all]` type-checks and builds with Next 16.3.6. |
| 0.4 Google | **Decided: yes** (Deej, 2026-09-30). Customers can sign in with Google as well as email and password. |

**Findings that change later phases:**

1. **The `clerkId` unique index breaks sign-up.** `users` has a unique index on `clerkId`, and Better Auth users don't have one, so MongoDB treats every new user's missing `clerkId` as the same null value. The first sign-up works and the second fails with `E11000 duplicate key … clerkId: null` (HTTP 422). Making the index unique only where `clerkId` is a string (`partialFilterExpression: { clerkId: { $type: "string" } }`) fixes it; the retry succeeded. Phase 2 adds this as a one-off index change, run before Better Auth is turned on anywhere. It's harmless to the current Clerk code.
2. **Reuse the existing `users` collection** (`user.modelName: "users"`). New users get `_id` (ObjectId), `name`, `email`, `emailVerified`, and `createdAt` and `updatedAt` as Dates. Existing users keep `clerkId`, `role` and their ISO-string dates, and still load in a session: the linked user's `createdAt` came back as the original string. Better Auth adds `session` and `account` collections (and `verification` once email verification or reset is used). `account.userId` is an ObjectId.
3. **Linking behaves as in the Day Planner.** Against the restored production user: **A** Clerk verified, local not verified → `account_not_linked`; **B** Clerk not verified, local verified → `account_not_linked`; **C** both verified → linked to the existing row, no duplicate, session is that row; **D** new email → new user. Existing users have no `emailVerified` field, which counts as not verified, so phase 5 sets it only after checking each email is verified in Clerk.
4. **Google follows the same rule.** Better Auth's Google provider takes `emailVerified` from Google's `email_verified` claim (`@better-auth/core` 1.7.6, `social-providers/google.mjs`), so a Google sign-in links to an existing user only when both sides are verified. Google isn't added to `trustedProviders` either.
5. **Create Better Auth on first use, not at import.** With the instance created when the module loads, `next build` logs a `BetterAuthError` about the default secret, because the build has no `BETTER_AUTH_SECRET`. The Day Planner's pattern (create it on first use, only when the secret is set) avoids this.
6. **Quotes need no re-linking.** Quotes store `userId` as a Clerk id string or null, and `/account` finds them by email, so order history carries over once the email is verified.

### Phase 1: One auth helper, still on Clerk (about 1 hour)
**Why:** today 11 files call Clerk directly. Moving them behind one helper first means the switch in phase 3 changes one file, and this step can ship to production on its own with no behaviour change.
- 1.1 Add `src/lib/session.ts` with `getSessionUser()` returning `{ id, email, emailVerified, name } | null`, and `requireSignedIn()`.
- 1.2 Move `admin-auth.ts`, `/account`, the quote routes, contact, groceries, `mongo-crud`, `quotes` and the CNC Technical AI components onto it.
- 1.3 Tests for the helper with Clerk mocked; existing route tests keep passing.
- 1.4 Staging check, then it can go to production with the next release.

### Phase 2: Server core behind the switch (about 2 hours)
**Why:** the same code runs both systems until cut-over, as in the Day Planner.
- 2.1 `src/lib/auth.ts`: `betterAuth({ database: mongodbAdapter(db, { client }), user: { modelName: "users" }, emailAndPassword, socialProviders: { google (when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set) }, plugins: [genericOAuth(clerk, when OIDC_* is set), nextCookies()] })`, created on first use only when `BETTER_AUTH_SECRET` is set (finding 5).
- 2.1a One-off script: make the `clerkId` unique index partial on dev, staging and production (finding 1), checked against a restored backup first.
- 2.2 `src/app/api/auth/[...all]/route.ts`; returns 404 while Better Auth is off.
- 2.3 `getSessionUser()` uses Better Auth when it's on and Clerk when it's off.
- 2.4 Email verification and password reset sent through the existing Resend `sendEmail()`.
- 2.5 Trusted origins, client IP from Render's `x-forwarded-for`, rate-limit rules.
- 2.6 Sign-up hook: give new users `role: "customer"`, matching existing documents. Admin comes only from `ADMIN_EMAILS` and a verified email (`isAdminUser`).
- 2.7 Tests: session, admin from `ADMIN_EMAILS`, unverified email not admin, origin parser, unlisted origin rejected.

### Phase 3: Pages and proxy (about 2–3 hours)
**Why:** Clerk's hosted components go away in Better Auth mode.
- 3.1 `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` and sign-out, built with `createAuthClient()` in the site's design. "Continue with Google" shows when Google is configured, and "Sign in with Clerk" only when `OIDC_*` is set.
- 3.2 `proxy.ts`: Better Auth session check for `/admin` and `/groceries` when on; `clerkMiddleware` when off. Keep the `www` redirect.
- 3.3 Navbar account menu and `AuthProvider` without `ClerkProvider` in Better Auth mode.
- 3.4 `next` redirects accept only same-site paths.

### Phase 4: Staging (about 1 hour, plus about 15 minutes from Deej)
- 4.1 **Deej:** add `BETTER_AUTH_SECRET` (`openssl rand -base64 32`, staging's own), `BETTER_AUTH_URL=https://staging.deejpotter.com` and `ADMIN_EMAILS` on `deejpotter-staging`.
- 4.2 **Deej, with approval:** create an OAuth application on the Clerk **production** instance, with scopes `openid email profile` and the redirect URI `https://staging.deejpotter.com/api/auth/callback/clerk`, then add `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` and `OIDC_DISCOVERY_URL` to staging.
- 4.2a **Deej:** create a Google OAuth client (Google Cloud console → APIs & Services → Credentials → OAuth client ID, type Web application) with the redirect URI `https://staging.deejpotter.com/api/auth/callback/google`, then add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to staging. The OAuth consent screen needs the app name, support email and the site's privacy policy link.
- 4.3 Check on staging:
  - email sign-up, verification email and sign-in
  - password reset
  - Google sign-in: a new Google account signs up, and one matching an existing verified user links to it
  - Clerk sign-in links to the existing verified user
  - `/admin` for an `ADMIN_EMAILS` user and refused for others
  - `/account` shows past quotes
  - quote submission while signed in
  - sign-out

### Phase 5: Production cut-over (about 30 minutes, plus a watch period)
- 5.1 Fresh backup (the phase 0.1 script), then the same env vars on `deejpotter` with production's own secret, a production-instance Clerk OAuth app for `https://deejpotter.com/api/auth/callback/clerk`, and `https://deejpotter.com/api/auth/callback/google` added to the Google client's redirect URIs.
- 5.2 Before switching, check in Clerk that each existing user's primary email is verified, then set `emailVerified: true` on those `users` documents (finding 3). Anyone left unverified gets `account_not_linked` until they verify.
- 5.3 Everyone signs in once more; Clerk sessions don't carry over.
- 5.4 **Rollback:** remove `BETTER_AUTH_SECRET` and the site is back on Clerk from the same build. Better Auth only adds collections, so nothing needs restoring.
- 5.5 Watch for 14 days, then remove Clerk: `@clerk/nextjs`, the Clerk webhook and `svix`, `CLERK_*` and `ADMIN_USER_IDS`, and the Clerk branches of `getSessionUser()` and `proxy.ts`. Keep the Clerk instance itself as the OIDC provider.

### Phase 6: Docs (alongside each phase)
- `docs/ARCHITECTURE.md` auth section, `docs/DEVELOPMENT.md` env vars, `.env.example`, `.github/TODOs.md`, and this file's results tables.

**Total:** about one working day of hands-on work (8–9 hours), based on actual pace: the quote-to-order flow on this site, which was larger, took about a day, and the Day Planner did its schema, auth core, pages, setup wizard and Settings (phases 1–5) in about two. The spike (0.3) is the only real unknown; if Better Auth can't reuse the `users` collection, add about 2 hours. Elapsed time depends on the waits, not the work: the Day Planner cut-over, Deej's Clerk and Render steps, and the 14-day watch before removing Clerk.

## 4. Risks

| Risk | Mitigation |
|---|---|
| Better Auth's MongoDB model doesn't fit the existing `users` collection | Checked in the spike: it fits once the `clerkId` index is partial (findings 1 and 2) |
| A Google or Clerk sign-in takes over an account by email | Linking needs both sides verified; neither provider is trusted (findings 3 and 4) |
| An OIDC sign-in links to the wrong account | Default linking rules; Clerk not in `trustedProviders`; tested in 0.3 and on staging (4.3) |
| Admin granted by an unverified email | `isAdminUser` requires `emailVerified` plus `ADMIN_EMAILS`; tested in 2.7 |
| Staging can't use the Clerk dev instance for OIDC | Production-instance OAuth app with the staging redirect (4.2) |
| Losing Clerk's bot protection on sign-up | Better Auth rate limits; sign-up only matters for order history, since customers can order without an account |

## References

<a id="ref-ba-mongo"></a>Better Auth. (n.d.). *MongoDB adapter*. Retrieved September 30, 2026, from https://www.better-auth.com/docs/adapters/mongo
