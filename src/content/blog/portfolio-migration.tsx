import { BlogPost } from "@/lib/blog";

const content = (
  <article className="blog-post">
    <p className="lead">
      My portfolio has evolved through three major technology stacks: PHP
      (2019-2021), Angular (2022-2023), and Next.js (2024-present). Each
      migration taught valuable lessons about choosing the right tool for the
      job.
    </p>

    <h2>Phase 1: PHP Foundation (2019-2021)</h2>
    <p>
      Started with traditional PHP stack: PHP 7.4, jQuery, Bootstrap 4, cPanel
      hosting, MySQL database.
    </p>

    <h3>Advantages</h3>
    <ul>
      <li>Simple deployment (FTP upload)</li>
      <li>Cheap hosting ($5/month)</li>
      <li>Familiar technology</li>
      <li>Works everywhere</li>
    </ul>

    <h3>Pain Points</h3>
    <ul>
      <li>No component reusability</li>
      <li>jQuery spaghetti code</li>
      <li>Manual asset optimization</li>
      <li>No type safety</li>
      <li>Page reloads for everything</li>
    </ul>

    <h2>Phase 2: Angular Migration (2022-2023)</h2>
    <p>
      Working at One Alpha Tech exposed me to Angular for enterprise
      applications. Decided to modernize portfolio using similar stack.
    </p>

    <h3>Migration Goals</h3>
    <ul>
      <li>Single Page Application (SPA) for smooth navigation</li>
      <li>TypeScript for type safety</li>
      <li>Component-based architecture</li>
      <li>Modern tooling (webpack, npm)</li>
    </ul>

    <pre>
      <code>{`@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.http.post('/api/contact', this.contactForm.value)
        .subscribe(response => {
          // Handle success
        });
    }
  }
}`}</code>
    </pre>

    <h3>Deployment Challenges</h3>
    <p>Angular build produced large bundles:</p>
    <ul>
      <li>Initial bundle: 2.4MB (uncompressed)</li>
      <li>First Contentful Paint: 3.2s</li>
      <li>Time to Interactive: 4.8s</li>
    </ul>

    <p>After optimization (lazy loading, AOT, tree shaking, gzip):</p>
    <ul>
      <li>Final bundle: 850KB</li>
      <li>FCP: 1.8s</li>
    </ul>

    <p>
      <strong>Still not great for a portfolio site.</strong>
    </p>

    <h3>SEO Problems</h3>
    <p>SPA architecture caused SEO issues:</p>
    <ul>
      <li>No server-side rendering (Angular Universal complexity deterrent)</li>
      <li>Search engines struggled with dynamic content</li>
      <li>Blank initial HTML (content loaded via JS)</li>
      <li>Meta tags not updating per route</li>
    </ul>

    <div className="alert alert-info">
      <h4>Lessons Learned</h4>
      <p>
        <strong>Angular excellent for:</strong> Large enterprise applications,
        complex state management, teams with Angular expertise, internal tools
        (SEO irrelevant)
      </p>
      <p>
        <strong>Angular overkill for:</strong> Simple portfolio sites,
        content-heavy pages, SEO-critical projects, solo developer projects
      </p>
    </div>

    <h2>Phase 3: Next.js Migration (2024-Present)</h2>
    <p>After leaving One Alpha Tech, I reassessed technology choices:</p>

    <h3>Requirements</h3>
    <ul>
      <li>Fast page loads (&lt; 1s FCP)</li>
      <li>SEO-friendly (SSR/SSG)</li>
      <li>Modern DX (TypeScript, hot reload)</li>
      <li>Component reusability</li>
      <li>Easy deployment</li>
    </ul>

    <p>
      <strong>Next.js checked all boxes.</strong>
    </p>

    <h3>Architecture Decisions</h3>
    <h4>Static Site Generation (SSG)</h4>
    <p>
      Portfolio content is mostly static. SSG makes sense - pages pre-rendered
      at build time, served as static HTML (CDN-friendly), zero server
      computation per request.
    </p>

    <pre>
      <code>{`// app/projects/page.tsx
export default function ProjectsPage() {
  // Static data at build time
  const projects = getProjects(); // No database call needed
  
  return (
    <div>
      <h1>Projects</h1>
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}`}</code>
    </pre>

    <h4>App Router (Next.js 13+)</h4>
    <p>Chose App Router for future-proofing:</p>
    <ul>
      <li>Server Components (reduced client JS)</li>
      <li>Streaming SSR support</li>
      <li>Improved layouts</li>
      <li>Better data fetching patterns</li>
    </ul>

    <h3>Component Migration</h3>
    <p>Angular components → React components was straightforward:</p>

    <div className="row">
      <div className="col-md-6">
        <h4>Before (Angular)</h4>
        <pre>
          <code>{`@Component({
  selector: 'app-project-card',
  template: \`
    <div class="card">
      <h3>{{ project.name }}</h3>
      <p>{{ project.description }}</p>
    </div>
  \`
})
export class ProjectCardComponent {
  @Input() project!: Project;
}`}</code>
        </pre>
      </div>
      <div className="col-md-6">
        <h4>After (React)</h4>
        <pre>
          <code>{`interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ 
  project 
}: ProjectCardProps) {
  return (
    <div className="card">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </div>
  );
}`}</code>
        </pre>
      </div>
    </div>

    <h3>API Routes</h3>
    <p>Contact form no longer needed separate backend:</p>

    <pre>
      <code>{`// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();
  
  // Server-side validation
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Send email
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: 'contact@deejpotter.com',
    subject: 'Contact Form Submission',
    text: \`From: \${name} (\${email})\\n\\n\${message}\`
  });
  
  return NextResponse.json({ success: true });
}`}</code>
    </pre>

    <h2>Performance Comparison</h2>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Angular SPA</th>
          <th>Next.js SSG</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>First Contentful Paint</td>
          <td>1.8s</td>
          <td>
            <strong>0.4s</strong>
          </td>
        </tr>
        <tr>
          <td>Time to Interactive</td>
          <td>3.2s</td>
          <td>
            <strong>0.6s</strong>
          </td>
        </tr>
        <tr>
          <td>Bundle Size</td>
          <td>850KB</td>
          <td>
            <strong>45KB HTML</strong>
          </td>
        </tr>
        <tr>
          <td>Lighthouse Score</td>
          <td>72/100</td>
          <td>
            <strong>100/100</strong>
          </td>
        </tr>
      </tbody>
    </table>

    <p className="lead">
      <strong>Result: 4.5x faster page loads</strong>
    </p>

    <h2>SEO Improvements</h2>
    <p>
      Next.js generates proper HTML for each page. Search engines see full
      content immediately.
    </p>

    <table className="table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Before</th>
          <th>After</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Google indexing</td>
          <td>Partial</td>
          <td>100% of pages</td>
        </tr>
        <tr>
          <td>Search impressions</td>
          <td>Baseline</td>
          <td>+340%</td>
        </tr>
        <tr>
          <td>Average position</td>
          <td>12</td>
          <td>6</td>
        </tr>
        <tr>
          <td>Click-through rate</td>
          <td>Baseline</td>
          <td>+180%</td>
        </tr>
      </tbody>
    </table>

    <h2>Cost Comparison</h2>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Aspect</th>
          <th>PHP</th>
          <th>Angular</th>
          <th>Next.js</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Hosting</td>
          <td>$5/mo</td>
          <td>$12/mo</td>
          <td>
            <strong>$0 (Netlify)</strong>
          </td>
        </tr>
        <tr>
          <td>Build time</td>
          <td>N/A</td>
          <td>45s</td>
          <td>22s</td>
        </tr>
        <tr>
          <td>Deploy time</td>
          <td>5min (manual)</td>
          <td>8min (manual)</td>
          <td>2min (auto)</td>
        </tr>
      </tbody>
    </table>

    <p>
      <strong>Current cost: $15/year (domain only)</strong>
    </p>

    <h2>Key Takeaways</h2>
    <ol>
      <li>
        <strong>Choose technology based on project needs, not trends:</strong>{" "}
        Portfolio sites don&apos;t need Angular&apos;s complexity. SSG better
        than SPA for content-heavy sites.
      </li>
      <li>
        <strong>Performance matters for portfolio:</strong> Slow load times →
        visitors leave. 100/100 Lighthouse score → professional impression.
      </li>
      <li>
        <strong>SEO critical for discoverability:</strong> SPAs require extra
        work (Angular Universal, React SSR). SSG gets SEO right by default.
      </li>
      <li>
        <strong>Developer experience impacts productivity:</strong> Next.js:
        faster iterations, less boilerplate. File-based routing simpler than
        manual route config.
      </li>
      <li>
        <strong>Migration is learning opportunity:</strong> Each stack taught
        valuable lessons. PHP: basics, Angular: enterprise patterns, Next.js:
        modern practices.
      </li>
    </ol>

    <div className="alert alert-success mt-4">
      <strong>Final verdict:</strong> Next.js optimal for portfolio sites. Fast,
      SEO-friendly, excellent DX. Would migrate again.
    </div>
  </article>
);

export const portfolioMigrationPost: BlogPost = {
  slug: "portfolio-migration",
  title: "Portfolio Migration: PHP to Angular to Next.js",
  date: "2024-11-04",
  excerpt:
    "Journey through three technology stacks over 5 years. From PHP to Angular to Next.js. Lessons learned about choosing the right tool: 4.5x performance improvement, 100/100 Lighthouse, $0 hosting.",
  tags: ["migration", "nextjs", "architecture", "portfolio"],
  content,
  readTime: 12,
  bookstackUrl:
    "http://bookstack.deejpotter.com/books/technical-blog-project-write-ups/page/portfolio-migration-php-to-angular-to-nextjs",
};
