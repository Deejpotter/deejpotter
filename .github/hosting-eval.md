# Hosting evaluation (short)

Goal: Replace Netlify hosting and serverless functions with a more generic deployment target (Coolify, Render, Vercel) and centralize server logic in Next.js where possible.

Options summary:

- Render
  - Pros: First-class support for Node services and static sites, simple PostgreSQL/Mongo addons, easy background jobs.
  - Cons: Slightly higher cost vs Coolify; good docs and support.
  - Works well for Next.js apps with standard server components and API routes.

- Vercel
  - Pros: Native Next.js support (optimal for edge functions & route handlers), fast builds, preview deployments.
  - Cons: Edge function limits, paid for team scale; serverless function cold starts if not using Pro/paid plans.

- Coolify
  - Pros: Self-hostable and cheap; suitable for hobby projects; supports Docker and Node services.
  - Cons: Requires ops (self-hosting or paid managed), not as turnkey as Render/Vercel.

Recommendation:
- If you want minimal friction and best Next.js experience, choose Vercel.
- If you want a simple managed platform with Node services and common DB addons, choose Render.
- If you want full control and lower cost and don't mind ops, consider Coolify.

Notes:
- All options support setting environment variables for MONGODB_URI and DB_NAME.
- If you move away from Netlify Identity, consider Clerk/Auth0/Supabase; they all have good SDKs for Next.js.
