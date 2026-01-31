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

- **Tailwind CSS**: Primary styling system (migration complete across critical components). We follow a Tailwind-first approach for all UI components.

## Development workflow (Storybook-first) ✅

We follow a Storybook-first, Tailwind-first workflow for UI changes:

1. Implement and validate UI components in Storybook as isolated units.
2. Add `*.stories.tsx` for each component with states (default, empty, error, edge cases).
3. Add Vitest unit tests and Playwright visual/Storybook snapshot tests for critical components.
4. Integrate the component into pages only after Storybook verification; remove legacy CSS/framework code in the same PR.

Benefits: faster iteration, smaller PRs, early visual regression detection, and better documentation for component usage.


- **Next.js**: The main framework used for building the website.

- **Netlify CMS**: For managing the content of the website.⚠️ This project is migrating away from Netlify in favor of Next.js Route Handlers and more portable hosting (see `.github/TODOs.md` and `.github/hosting-eval.md`).
- **Netlify Forms**: For handling the contact form submissions.⚠️ This project is migrating away from Netlify in favor of Next.js Route Handlers and more portable hosting (see `.github/TODOs.md` and `.github/hosting-eval.md`).
- **Netlify Identity**: For user authentication.⚠️ This project is migrating away from Netlify in favor of Next.js Route Handlers and more portable hosting (see `.github/TODOs.md` and `.github/hosting-eval.md`).
- **Netlify Functions**: For handling dynamic functionality. ⚠️ This project is migrating away from Netlify in favor of Next.js Route Handlers and more portable hosting (see `.github/TODOs.md` and `.github/hosting-eval.md`).

- **Bootstrap**: For styling the website.⚠️ This project is migrating away from Bootstrap in favor of Tailwind CSS (see `.github/TODOs.md` and `.github/hosting-eval.md`).

- **React**: For building the user interface components.

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
