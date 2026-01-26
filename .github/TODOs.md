# Project TODOs for Deej Potter Portfolio

## Overview
A concise, actionable roadmap to clean up the repo, migrate off Netlify, strengthen CI/CD, improve testing, documentation, security, and performance. All tasks are listed in this file so they appear in the GitHub UI and can be tracked via Issues/Projects.

## Detailed Plan and Sub‑steps

### 1️⃣ Clean & Streamline the Build Stack
- **1.1 Remove unused Babel tooling**
  - Run yarn remove @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @babel/helpers @babel/runtime.
  - Verify package.json no longer lists any @babel/* packages.
- **1.2 Drop Bootstrap & legacy CSS**
  - Search for bootstrap imports (git grep bootstrap src).
  - Replace UI components with Tailwind equivalents or delete them.
  - Run yarn remove bootstrap @types/bootstrap.
- **1.3 Clean ESLint config**
  - Remove eslint-plugin-react-hooks (yarn remove eslint-plugin-react-hooks).
  - Keep only eslint-config-next and @typescript-eslint/*.
- **1.4 (Optional) Migrate to Yarn Berry**
  - Run yarn set version berry.
  - Commit .yarnrc.yml and update engines in package.json.

### 2️⃣ Harden the Netlify Migration
- **2.1 Create migration folder & docs**
  - mkdir -p migration && touch migration/netlify-to-route-handlers.md migration/cms-to-mdx.md migration/forms-to-api-routes.md.
  - Populate each with a brief description and checklist.
- **2.2 Add a GitHub Project board** (optional manual step).
- **2.3 Add a helper script to list Netlify‑specific files**
  Create scripts/list-netlify-files.js with:
  import { shell } from "developer";
  const files = shell({ command: "git ls-files | grep netlify" });
  console.log(files);

### 3️⃣ CI/CD Pipeline (GitHub Actions)
- **3.1 Create .github/workflows/ci.yml** with steps for install, lint, type‑check, test (Vitest coverage), build, and upload artifacts.
- **3.2 Add CI badge to README**.
- **3.3 Optional CI enhancements** – deploy‑preview workflow, Dependabot config (.github/dependabot.yml), CodeQL analysis.

### 4️⃣ Strengthen Testing & Coverage
- **4.1 Expand Vitest unit tests** – add tests for critical UI components (ContactForm, Nav, ProjectCard).
- **4.2 Add Playwright E2E suite** – test each public page and the contact form flow.
- **4.3 Generate coverage reports** – ensure yarn test:coverage outputs HTML and is uploaded in CI.
- **4.4 Example test snippets** are included in src/__tests__/ folder.

### 5️⃣ Documentation & Onboarding
- **5.1 Add README badges** (CI, Node, License).
- **5.2 Create CONTRIBUTING.md** with workflow checklist.
- **5.3 Add CODEOWNERS** to assign ownership of src/**.
- **5.4 Mirror essential BookStack pages into docs/ folder (setup, architecture, migration notes).
- **5.5 Optional**: set up a static docs site (Docusaurus or MkDocs).

### 6️⃣ Security & Secrets Management
- **6.1 Enforce secrets via GitHub Actions** – move any .env values to repository secrets.
- **6.2 Add a pre‑commit hook** to warn when .env* files are staged.
- **6.3 Enable Dependabot alerts** and add dependabot.yml.
- **6.4 Add CodeQL workflow** for static analysis.

### 7️⃣ Performance & SEO Optimizations
- **7.1 Replace raw <img> tags with Next.js <Image> component.
- **7.2 Verify Tailwind purge configuration (content paths include all .tsx files).
- **7.3 Run bundle analyzer (next build && npx next-bundle-analyzer).
- **7.4 Ensure ISR for marketing pages (revalidate: 60).

### 8️⃣ Project Management & Roadmap Visibility
- **8.1 Create TODO.md (this file) summarizing milestones.
- **8.2 Link TODO.md from the README under “Current Work & Roadmap”.
- **8.3 Enable GitHub Projects and pin the board to the repo.

### 9️⃣ Optional Developer Experience Boosts
- **9.1 Storybook static build integration in CI.
- **9.2 Husky + lint‑staged for auto‑format on commit.
- **9.3 VSCode DevContainer for reproducible environment.
- **9.4 Consider TurboRepo/pnpm if the repo ever splits into packages.
