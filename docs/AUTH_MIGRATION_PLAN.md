# Better Auth migration plan — deejpotter.com

**Status:** Planned, 2026-09-30. Starts after the Day Planner's cut-over (its phase 8), so its tested Clerk-linking flow can be reused. No code has changed yet.
**Goal:** deejpotter.com owns its users and sessions in its own MongoDB through Better Auth, and stops depending on Clerk's SDK. Clerk stays only as the shared sign-in hub for Deej's apps, connected as an optional "Sign in with Clerk" (OpenID Connect) provider, the same way the Day Planner does it.

This follows the Day Planner's plan (`Deejpotter/day-planner`, `docs/AUTH-SELF-HOSTING-PLAN.md`) and reuses its decisions and findings. Only the differences are argued here.

## 1. What carries over from the Day Planner

| Decision or finding | Why it applies here too |
|---|---|
| Better Auth switches on per deployment when `BETTER_AUTH_SECRET` is set | Staging can run Better Auth while production stays on Clerk, from the same code |
| Plugins: email and password, admin, Generic OAuth, `nextCookies` only | Fewer plugins means fewer advisories to track; this site needs no API keys, SSO, SCIM or organisations |
| Clerk connected through Generic OAuth, **never** in `trustedProviders` | An OIDC sign-in links to an existing user only when Clerk reports the email as verified *and* the local user is verified (Day Planner phase 0 finding 1) |
| Callback path is `/api/auth/callback/{providerId}` | Better Auth 1.7 registers Generic OAuth providers as social providers (Day Planner finding 6) |
| A Clerk **development** instance can't act as the OIDC provider in a browser | Staging needs an OAuth app on the Clerk **production** instance, with the staging redirect URI (Day Planner finding 7) |
| Stricter rate limits on sign-in, sign-up and password reset; memory storage | Each Render service runs one instance |
| Trusted origins built from `BETTER_AUTH_URL` plus optional `TRUSTED_ORIGINS` | Staging and production each trust only their own origin |

## 2. What's different here

| | Day Planner | deejpotter.com | Consequence |
|---|---|---|---|
| Database | Postgres with Prisma | MongoDB, native driver (`src/lib/db.ts`) | Use `mongodbAdapter`. MongoDB needs no schema generation or migration, and passing the `MongoClient` enables transactions ([Better Auth, n.d.](#ref-ba-mongo)). How ids are stored and whether the existing `users` collection can be reused aren't documented, so the spike decides (0.3) |
| Host | Coolify (Docker) | Render (Node) | No image or entrypoint work; env vars set through the Render API |
| Email | Optional SMTP | Resend already configured | Password reset and email verification work from the start |
| Self-hosting | Setup wizard, API keys, public docs site | Not needed | Skip Day Planner phases 4, 6 and 7 and the API-key plugin |
| Admin | `role` column set by a script | `ADMIN_USER_IDS` env var of Clerk ids | Becomes `ADMIN_EMAILS`, matched only against a **verified** email. This keeps the rule in `src/lib/admin-auth.ts` that only the server environment can grant admin |
| Customer data | Tasks owned by user id | Quotes found by **email** (`/account` lists by `userEmail`) | Order history carries over without re-linking; `quotes.userId` (a Clerk id) is kept only for reference |
| Clerk usage | Behind one `getAuthContext()` | `auth()` / `currentUser()` called directly in 11 files, 19 import Clerk | Put one helper in front of Clerk **before** switching (phase 1), so the switch touches one file |

## 3. Plan

Each phase ends with type-check, lint, tests and build passing, lands on `dev`, and is checked on staging before any `dev` → `main` PR.

### Phase 0: Prepare (½ day)
**Why:** test the one real unknown, MongoDB, before any code depends on it.
- 0.1 Back up the production and staging databases (`mongodump`) and test a restore into a scratch database. A backup that's never been restored doesn't count.
- 0.2 Wait for the Day Planner cut-over and note anything its phase 8 changed.
- 0.3 Spike on a throwaway branch against a restored copy:
  - Better Auth with `mongodbAdapter(db, { client })`, on Next 16
  - whether Better Auth can own the existing `users` collection (field mapping, ISO-string dates, `clerkId`) or needs its own `user` collection; record the choice here
  - how ids are stored (ObjectId or string), because quotes store user ids
  - account linking against a mock OIDC provider, repeating Day Planner scenarios A–D
- 0.4 Decide whether customers get Google sign-in as well as email and password (default: no, to match the Day Planner).

### Phase 1: One auth helper, still on Clerk (½ day)
**Why:** today 11 files call Clerk directly. Moving them behind one helper first means the switch in phase 3 changes one file, and this step can ship to production on its own with no behaviour change.
- 1.1 Add `src/lib/session.ts` with `getSessionUser()` returning `{ id, email, emailVerified, name } | null`, and `requireSignedIn()`.
- 1.2 Move `admin-auth.ts`, `/account`, the quote routes, contact, groceries, `mongo-crud`, `quotes` and the CNC Technical AI components onto it.
- 1.3 Tests for the helper with Clerk mocked; existing route tests keep passing.
- 1.4 Staging check, then it can go to production with the next release.

### Phase 2: Server core behind the switch (1 day)
**Why:** the same code runs both systems until cut-over, as in the Day Planner.
- 2.1 `src/lib/auth.ts`: `betterAuth({ database: mongodbAdapter(db, { client }), emailAndPassword, plugins: [admin(), genericOAuth(clerk, optional), nextCookies()] })`, created on first use only when `BETTER_AUTH_SECRET` is set.
- 2.2 `src/app/api/auth/[...all]/route.ts`; returns 404 while Better Auth is off.
- 2.3 `getSessionUser()` uses Better Auth when it's on and Clerk when it's off.
- 2.4 Email verification and password reset sent through the existing Resend `sendEmail()`.
- 2.5 Trusted origins, client IP from Render's `x-forwarded-for`, rate-limit rules.
- 2.6 Sign-up hook: stamp new users `customer`. Admin comes only from `ADMIN_EMAILS` and a verified email (`isAdminUser`).
- 2.7 Tests: session, admin from `ADMIN_EMAILS`, unverified email not admin, origin parser, unlisted origin rejected.

### Phase 3: Pages and proxy (1 day)
**Why:** Clerk's hosted components go away in Better Auth mode.
- 3.1 `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` and sign-out, built with `createAuthClient()` in the site's design. The "Sign in with Clerk" button shows only when `OIDC_*` is set.
- 3.2 `proxy.ts`: Better Auth session check for `/admin` and `/groceries` when on; `clerkMiddleware` when off. Keep the `www` redirect.
- 3.3 Navbar account menu and `AuthProvider` without `ClerkProvider` in Better Auth mode.
- 3.4 `next` redirects accept only same-site paths.

### Phase 4: Staging (½ day, needs Deej)
- 4.1 **Deej:** add `BETTER_AUTH_SECRET` (`openssl rand -base64 32`, staging's own), `BETTER_AUTH_URL=https://staging.deejpotter.com` and `ADMIN_EMAILS` on `deejpotter-staging`.
- 4.2 **Deej, with approval:** create an OAuth application on the Clerk **production** instance, with scopes `openid email profile` and the redirect URI `https://staging.deejpotter.com/api/auth/callback/clerk`, then add `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` and `OIDC_DISCOVERY_URL` to staging.
- 4.3 Check on staging:
  - email sign-up, verification email and sign-in
  - password reset
  - Clerk sign-in links to the existing verified user
  - `/admin` for an `ADMIN_EMAILS` user and refused for others
  - `/account` shows past quotes
  - quote submission while signed in
  - sign-out

### Phase 5: Production cut-over (½ day plus a watch period)
- 5.1 Fresh `mongodump`, then the same env vars on `deejpotter` with production's own secret, and a production-instance OAuth app for `https://deejpotter.com/api/auth/callback/clerk`.
- 5.2 Before switching, check in Clerk that each existing user's primary email is verified; unverified users get `account_not_linked` until they verify.
- 5.3 Everyone signs in once more; Clerk sessions don't carry over.
- 5.4 **Rollback:** remove `BETTER_AUTH_SECRET` and the site is back on Clerk from the same build. Better Auth only adds collections, so nothing needs restoring.
- 5.5 Watch for 14 days, then remove Clerk: `@clerk/nextjs`, the Clerk webhook and `svix`, `CLERK_*` and `ADMIN_USER_IDS`, and the Clerk branches of `getSessionUser()` and `proxy.ts`. Keep the Clerk instance itself as the OIDC provider.

### Phase 6: Docs (alongside each phase)
- `docs/ARCHITECTURE.md` auth section, `docs/DEVELOPMENT.md` env vars, `.env.example`, `.github/TODOs.md`, and this file's results tables.

**Total:** about 4½ working days, plus the Day Planner wait and the 14-day watch.

## 4. Risks

| Risk | Mitigation |
|---|---|
| Better Auth's MongoDB model doesn't fit the existing `users` collection | Spike 0.3; fall back to its own `user` collection, joined by email |
| An OIDC sign-in links to the wrong account | Default linking rules; Clerk not in `trustedProviders`; tested in 0.3 and on staging (4.3) |
| Admin granted by an unverified email | `isAdminUser` requires `emailVerified` plus `ADMIN_EMAILS`; tested in 2.7 |
| Staging can't use the Clerk dev instance for OIDC | Production-instance OAuth app with the staging redirect (4.2) |
| Losing Clerk's bot protection on sign-up | Better Auth rate limits; sign-up only matters for order history, since customers can order without an account |

## References

<a id="ref-ba-mongo"></a>Better Auth. (n.d.). *MongoDB adapter*. Retrieved September 30, 2026, from https://www.better-auth.com/docs/adapters/mongo
