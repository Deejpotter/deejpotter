# Decap CMS content

This folder is the planned home for Decap-authored blog posts.

Current state:
- the live blog still reads from `src/content/blog/*.tsx`
- Decap has been scaffolded under `public/admin/`
- the next migration step is to teach the site to read Markdown/MDX posts from this folder

Intended frontmatter shape:
- title
- slug
- date
- excerpt
- tags
- draft

Once the loader is migrated, Decap-authored posts in this folder can become the primary blog source.
