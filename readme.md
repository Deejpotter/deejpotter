# Deej Potter's Portfolio

Hi, I'm Daniel, or Deej, a full-stack developer who used to be a chef. This is the repo for my portfolio website, which I've built with Next.js.

## A Bit About Me

I started out working in my parents' restaurant, but I've always been more interested in tech. I eventually started a web design business from home, which led me to dive deeper into coding and become a full-stack developer.

## This Project

This is my portfolio and small business site. Here's what you'll find:

1. **About, Privacy and Terms pages**
2. **Contact page**: A contact form handled by a Next.js Route Handler (`/api/contact`) that sends email through Resend.
3. **Blog**: posts written by hand, as Markdown in `src/content/blog-md` or formatted pages in `src/content/blog`, with an RSS feed at `/blog/rss.xml`.
4. **Projects**: Websites, games, apps, tools, engineering projects and services.
5. **3D printing quotes**: Customers upload models, get a quote, and pay for accepted quotes with Stripe. There is no general shop; payments only go through quotes.
6. **Admin area**: Quotes, leads and settings. Only the Clerk user IDs listed in the `ADMIN_USER_IDS` environment variable can get in.
7. **Groceries**: A small personal groceries tool.

I first built this with Angular and later moved it to Next.js. It started out on Netlify CMS, Forms, Identity and Functions. Forms, Identity and Functions have been replaced with Next.js Route Handlers, Clerk and MongoDB, and the CMS was dropped: blog posts are written by hand (see `src/content/blog-md/README.md`). The site is hosted on Render, which runs it as a Node server (`yarn build` then `yarn start`). `dev` deploys to staging and `main` to production.

## Technologies and Tools

- **Next.js 16 (App Router) and React 19**
- **TypeScript**
- **Tailwind CSS v4**: CSS-first configuration with `@theme` blocks in `globals.css`.
- **Clerk**: Sign-in and user accounts.
- **MongoDB**: Quotes, contact leads, grocery orders, users and settings.
- **Stripe**: Payments for accepted quotes, with a webhook at `/api/webhooks/stripe`.
- **Cloudflare R2 (S3 API)**: Storage for uploaded quote files. See `R2_SETUP.md`.
- **Resend**: Transactional email.
- **React Three Fiber**: 3D model previews.
- **Vitest + React Testing Library**: Unit and component tests.
- **Playwright**: End-to-end specs in `e2e/` for local use.

## Testing

- **Node 22** required (`package.json` engines, `.nvmrc`)
- Unit/component tests: `yarn test`
- Some API route tests start an in-memory MongoDB, which downloads a MongoDB binary the first time they run.
- CI runs lint, stylelint, Vitest and the build on push to `main`/`dev`
- Playwright E2E specs: `yarn test:e2e` (not run in CI)

## Code style

- **Explain things in comments**: I like to use comments to easily explain what a block of code does for future reference because I will definitely forget.
- **Types**: I use TypeScript for type-checking and I like to use types over interfaces.
- **Formatting**: I use Prettier for code formatting.
- **File structure**: I have all my app code in the app folder and all the other stuff, like components and styles, above that in the src folder.

## Quick Start (Yarn)

> **Note:** This project uses Yarn. If you don't have Yarn enabled, enable Corepack and set the stable Yarn version with:
>
> ```bash
> corepack enable && yarn set version stable
> ```
>
> Avoid mixing package managers (npm vs Yarn). If you previously used npm, remove `package-lock.json` before installing with Yarn to prevent lockfile conflicts.

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```

Visit `http://localhost:3000` to view the application.

## Running tests

- Unit & component tests: `yarn test` (Vitest + React Testing Library)
- E2E tests: `yarn test:e2e` (Playwright, local only)

When converting or adding components, add Vitest unit tests and Playwright visual checks for critical pages/components.

For detailed setup instructions, see the [Setup & Installation](http://bookstack.deejpotter.com/books/deejpottercom/page/setup-installation) guide in BookStack.

## Documentation

This README provides a high-level overview. For detailed documentation, please visit our **[BookStack Documentation](http://bookstack.deejpotter.com/books/deejpottercom)** which includes:

- 📋 [AI Assistant Guidelines](http://bookstack.deejpotter.com/books/deejpottercom/page/ai-assistant-guidelines) - For AI assistants and contributors
- ✅ [TODO & Roadmap](http://bookstack.deejpotter.com/books/deejpottercom/page/todo-roadmap) - Current tasks and future plans
- 🏗️ [Technical Documentation](http://bookstack.deejpotter.com/books/deejpottercom/chapter/technical-documentation) - Architecture and setup guides
- ⚡ [Features & Implementation](http://bookstack.deejpotter.com/books/deejpottercom/chapter/features-implementation) - Feature documentation

## Contributing

When contributing to this project:

1. Review the [AI Assistant Guidelines](http://bookstack.deejpotter.com/books/deejpottercom/page/ai-assistant-guidelines)
2. Check the [TODO & Roadmap](http://bookstack.deejpotter.com/books/deejpottercom/page/todo-roadmap)
3. Follow conventional commit messages
4. Update BookStack documentation for any changes
5. If you change testing or UI frameworks (e.g., Vitest, Playwright, Tailwind), update the README, `.github/copilot-instructions.md`, and `.github/TODOs.md` to record the new workflow and rationale.
6. Add or update tests for any changed behavior. New features and bug fixes must include tests covering the behavior and aim to keep coverage above the project thresholds.
7. Test thoroughly before submitting

## License

This project is personal portfolio work. Please contact for usage inquiries.
