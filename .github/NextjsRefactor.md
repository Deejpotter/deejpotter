# Setup Next.js Environment

Install Next.js and create a new project.
Install Node.js and npm (if not already installed).
Run npx create-next-app to create a new Next.js project.
Configure TypeScript (if necessary).
Install TypeScript and necessary @types packages.
Update the tsconfig.json file with desired settings.
Set up a basic layout component.
Create a _app.js file.
Implement a basic layout in this file.
Refactor Pages

For each page in the Angular project, create a corresponding page in the Next.js project.
Create a file for each page in the pages directory.
Convert the template and logic from Angular to React.
Set up any necessary static generation or server-side rendering.
Use getStaticProps for static generation.
Use getServerSideProps for server-side rendering.
Test each page individually to ensure functionality matches the original.
Refactor Components

Identify shared components in the Angular project.
For each shared component, create a corresponding component in the Next.js project.
Create a file for each component in the components directory.
Convert the template and logic from Angular to React.
Test each component individually.
Refactor Services and Repositories

Identify all services and repositories in the Angular project.
For each service or repository, create corresponding functionality in the Next.js project.
This might involve creating API routes, utility functions, hooks, or context providers.
Test each service or repository individually.
Setup SCSS

Install sass.
Run npm install sass.
Convert all global styles to SCSS and import them in _app.js.
Rename global.css to global.scss.
Import the new global.scss file in_app.js.
Convert component-specific styles to CSS modules with SCSS.
Verify all pages and components to ensure styles are correctly applied.
Setup Netlify CMS

Update config.yml for Netlify CMS.
Make sure the collections and fields match the new structure.
Setup static generation for each CMS-managed page.
In each page component, fetch data from Netlify CMS using getStaticProps.
Test CMS functionality.
Setup Netlify Forms

Identify all forms in the Angular project.
For each form, create a corresponding form in the Next.js project.
This could involve creating new components or adding forms to existing components.
Set up API route(s) to handle form submission and interaction with Netlify Forms.
Create a new file in the pages/api directory for each form.
In each API route, implement logic to handle form data and interact with Netlify Forms.
Test each form individually.
Setup Netlify Identity

Install and configure next-auth with Netlify Identity as a provider.
Run npm install next-auth.
Create a [...nextauth].js file in the pages/api/auth directory.
In this file, configure next-auth to use Netlify Identity.
Identify all parts of the Angular project that require user authentication.
For each of these parts, implement authentication in the Next.js project.
This could involve protecting routes, showing/hiding UI elements based on authentication status, etc.
Test all authentication-dependent functionality.
Refactor WebGL Games Hosting

Identify how games are served in the Angular project.
Implement a similar setup in the Next.js project, which may involve dynamic routes and/or static files.
Test each game individually.
Testing

Install Jest and React Testing Library.
Run npm install jest react-testing-library.
Refactor or recreate each test from the Angular project in the Next.js project.
For each test in the Angular project, create a corresponding test in the Next.js project.
Update the test logic to work with React and Jest.
Create any additional tests necessary to ensure all functionality is covered.
Run all tests and fix any issues.
Update Netlify Configuration

Update netlify.toml configuration to work with Next.js.
Update the build command and publish directory.
Test the deployment process locally using Netlify CLI.
Install Netlify CLI.
Run netlify dev to start a local development server.
Fix any deployment issues.
Deployment

Push the Next.js project to the git repository.
Run git add ., git commit -m "message", and git push.
Trigger a deploy on Netlify.
This could be done automatically by pushing to a certain branch, or manually in the Netlify dashboard.
Test the live site and fix any issues.

---

## App Router & Modern Next guidance

- This project uses the App Router (`src/app`) — prefer `route.ts` route handlers for server APIs instead of pages/api. Example: see `src/app/api/mongo-crud/route.ts` that replaces the legacy Netlify function.
- Keep UI logic in client components (`use client`) and server logic in route handlers or server components.
- For auth, the repository currently uses `src/contexts/AuthContext.tsx` (Netlify Identity widget). If you migrate hosting, update `AuthContext` to use the chosen provider's client SDK or keep Netlify Identity as an external auth service.
- For forms, replace Netlify Forms if you leave Netlify: create POST handlers (`src/app/api/your-form/route.ts`) to accept form submissions and persist or forward as needed.

> Note: The above reflects the current structure and migration plan: move serverless logic into Next.js route handlers for easier hosting portability.
