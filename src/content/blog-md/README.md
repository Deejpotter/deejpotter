# Decap CMS content

This folder is now the live home for Decap-authored Markdown blog posts.

Current state:
- the site reads published Markdown posts from `src/content/blog-md/*.md`
- existing TSX posts in `src/content/blog/*.tsx` still work in parallel
- Decap is scaffolded under `public/admin/`
- drafts are supported through frontmatter and are excluded from the public blog by default

Frontmatter shape:
- title
- slug
- date
- excerpt
- tags
- draft
- bookstackUrl (optional)

Notes:
- use `.md` files with frontmatter
- keep slugs unique across both Markdown and TSX posts
- normal editorial posts should prefer Markdown
- keep TSX for posts that genuinely need custom React rendering
