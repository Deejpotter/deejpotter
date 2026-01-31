# Deej Potter's Portfolio

Hi, I'm Daniel, or Deej, a full-stack developer who used to be a chef. This is the repo for my portfolio website, which I've built with Next.js.

## A Bit About Me

I started out working in my parents' restaurant, but I've always been more interested in tech. I eventually started a web design business from home, which led me to dive deeper into coding and become a full-stack developer.

## This Project

This portfolio website is my playground where I get to showcase my coding projects and talk about my journey in tech. Here's what you'll find:

1. **About Page**: Just a bit about me and how I ended up in the tech world.
2. **Contact Page**: A simple contact form built with Netlify Forms. Try it out, send me a message and I'll get back to you.
3. **Website Projects**: Some of the websites I've built. I've used Netlify CMS to manage the content.
4. **Games**: I've made a few WebGL games, which I've showcased here.
5. **Technical Apps**: Here, I've showcased some technical apps with dynamic functionality that I've built.
6. **Engineering Projects**: A section dedicated to engineering projects, including the "Wireless Car" project.
7. **Privacy and Terms**: Pages outlining the privacy policy and terms of service.

I initially built this project with Angular, but I've recently migrated it to Next.js for the SSG SEO benefits. I'm using Netlify CMS for content management, Netlify Forms for the contact form, and Netlify Identity for user authentication. I'm also using Netlify Functions to handle dynamic functionality. And, it's hosted on Netlify, of course.

## Technologies and Tools

- **Next.js 16**: The main framework (App Router, Turbopack, Server Components).
- **Tailwind CSS v4**: Utility-first CSS framework with CSS-based configuration (`@import "tailwindcss"`, `@theme`, `@plugin` directives).
- **Clerk**: Authentication provider (`@clerk/nextjs`). Requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables.
- **MongoDB**: Database for dynamic content via Next.js Route Handlers (`src/app/api/mongo-crud/route.ts`).
- **Vitest**: Testing framework with React Testing Library.
- **TypeDoc**: API documentation generation.

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your Clerk keys from [Clerk Dashboard](https://dashboard.clerk.com)
3. Add MongoDB connection string if using database features

```bash
# Required for authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Required for database features
MONGODB_URI=mongodb+srv://...
DB_NAME=your-database
```

## Code style

- **Explain things in comments**: I like to use comments to easily explain what a block of code does for future reference because I will definitely forget.
- **Types**: I use TypeScript for type-checking and I like to use types over interfaces.
- **Formatting**: I use Prettier for code formatting.
- **File structure**: I have all my app code in the app folder and all the other stuff, like components and styles, above that in the src folder.

## Quick Start (Yarn)

> **Note:** This project uses Yarn Classic (v1). If you don't have Yarn installed globally, install it with:
>
> ```bash
> npm install -g yarn
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
5. Test thoroughly before submitting

## License

This project is personal portfolio work. Please contact for usage inquiries.
