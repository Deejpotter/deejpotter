# Markdown blog posts

Blog posts can be written two ways:

1. **Markdown (this folder).** Add a `.md` file here with front matter like
   `openclaw-android-pairing-request-churn.md`: `title`, `slug`, `date`,
   `excerpt`, `tags`, and `draft`. `src/lib/blog.ts` picks it up automatically.
   Set `draft: true` to keep a post off the site.
2. **A formatted page.** For posts that need custom layout, write a TSX file in
   `src/content/blog/` (see `portfolio-migration.tsx`) and register it in
   `src/lib/blog.ts`.
