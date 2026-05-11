# Decap CMS plan for deejpotter

## What is implemented now

### 1. Repo-backed admin UI scaffold

- `public/admin/index.html`
- `public/admin/config.yml`

The CMS is wired as a repo-backed Decap setup, not a separate hosted content store.

### 2. Markdown blog source added

- Decap-authored blog content now lives in `src/content/blog-md/`
- The site reads `.md` files from that folder using frontmatter
- Existing TSX blog posts still work in parallel

### 3. Mixed-source blog loader

The blog system now supports two sources at once:

- `src/content/blog/*.tsx` for older or highly custom posts
- `src/content/blog-md/*.md` for Decap-authored posts

This avoids a risky all-at-once migration.

### 4. Public rendering for Markdown posts

Markdown posts are rendered on `/blog/[slug]` using:
- `gray-matter` for frontmatter parsing
- `react-markdown`
- `remark-gfm` for GitHub-flavoured markdown features like tables

### 5. Decap-friendly authoring path

- Example migrated post: `src/content/blog-md/openclaw-android-pairing-request-churn.md`
- Upload path scaffolded under `public/uploads/`
- Local CMS helper script added:
  - `npm run cms`
  - `npm run cms:dev`

## Why this implementation is the right fit

- Content stays in git, which matches the repo-first workflow you wanted.
- Future graphical editing is possible without moving content into a SaaS CMS.
- Existing posts were preserved instead of rewritten under pressure.
- Future normal posts can be authored in Markdown through Decap.
- Special-case technical posts can still use TSX when custom React layout is genuinely useful.

## Important workflow note

`local_backend: true` is enabled for local editing convenience, but Decap editorial workflow is primarily meaningful against the GitHub backend. In practice that means:

- local dev/testing → use local backend behaviour
- real draft/publish workflow → GitHub-backed editorial workflow on the configured repo branch

## Recommended next step

If you want this fully polished for daily writing, the next step is:

1. add an `/admin` link somewhere private or documented
2. test the Decap login flow against GitHub auth for the real hosted site
3. optionally migrate more existing posts from TSX to Markdown over time
