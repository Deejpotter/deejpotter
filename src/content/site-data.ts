export type ServiceOffering = {
  id: string;
  name: string;
  description: string;
  features: string[];
  link: string;
  cta: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

export type ShowcaseItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  label: string;
};

export const serviceOfferings: ServiceOffering[] = [
  {
    id: "website-design-development",
    name: "Website Design and Development",
    description:
      "Clean, responsive websites built to convert visitors into customers. No templates, no page builders — just a site that works for your business.",
    features: [
      "Small business and portfolio websites",
      "Landing pages that actually convert",
      "Redesigns for sites that feel outdated",
      "Clear, maintainable code you can hand to any developer",
    ],
    link: "/projects/services/website-design",
    cta: "Start a website project",
  },
  {
    id: "website-redesign",
    name: "Website Redesign",
    description:
      "Your site works but it doesn't work well. A focused redesign that fixes the structure, messaging, and conversion flow — without starting from scratch.",
    features: [
      "Clearer messaging that actually says what you do",
      "Better mobile experience",
      "Faster load times",
      "Stronger calls to action that get results",
    ],
    link: "/projects/services/website-redesign",
    cta: "Ask about a redesign",
  },
  {
    id: "custom-tools-automation",
    name: "Custom Tools and Automation",
    description:
      "When off-the-shelf software doesn't quite fit. Purpose-built calculators, internal tools, and workflow helpers that save hours of manual work.",
    features: [
      "Custom calculators for pricing, quoting, or estimation",
      "Internal dashboards and admin tools",
      "Workflow automation for repetitive tasks",
      "Data tools — imports, exports, reports",
    ],
    link: "/projects/services/custom-tools",
    cta: "Ask about a custom tool",
  },
  {
    id: "3d-printing",
    name: "On-Demand 3D Printing",
    description:
      "Upload your file, see your model in 3D, and get an instant price. Prototypes, replacement parts, and small-run prints — no CAD experience needed.",
    features: [
      "Instant quoting from your STL file",
      "3D model preview before you submit",
      "PLA and PETG materials",
      "Local pickup or delivery around Frankston",
    ],
    link: "/projects/services/3d-printing",
    cta: "Get a quote",
  },
  {
    id: "cad-cam-fabrication",
    name: "CAD, CAM, and Fabrication",
    description:
      "Laser cutting, CNC milling, and CAD file prep for people who need a physical result without learning the software.",
    features: [
      "Laser engraving and cutting (wood, acrylic)",
      "CNC milling for signs, panels, and parts",
      "CAD models and file prep from your sketches or ideas",
      "DXF and SVG upload with live preview",
    ],
    link: "/projects/services/cad-cam-fabrication",
    cta: "Talk about fabrication",
  },
];
export const processSteps: ProcessStep[] = [
  {
    id: "brief",
    title: "You tell me what you need",
    description:
      "Send a brief — the problem, the deadline, what success looks like. I'll tell you honestly whether it's a fit and what it'll cost.",
  },
  {
    id: "build",
    title: "I build it — no black boxes",
    description:
      "Clear structure, working build, then refinement. You'll see progress, not excuses. If something needs changing, we change it.",
  },
  {
    id: "deliver",
    title: "You get a working result",
    description:
      "A site that converts. A part that fits. A tool that saves you hours. Handed over with instructions, not a headache.",
  },
];

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "website-projects",
    title: "Website projects",
    description:
      "Small business sites, portfolio refreshes, and redesigns — built clean, fast, and easy to maintain.",
    link: "/projects/websites",
    label: "Browse websites",
  },
  {
    id: "tools",
    title: "Custom tools",
    description:
      "Calculators, workflow helpers, and internal tools that save hours of manual work every week.",
    link: "/projects/tools",
    label: "Explore tools",
  },
  {
    id: "services",
    title: "All services",
    description:
      "Websites, 3D printing, laser cutting, CNC milling, and custom development — everything I take on.",
    link: "/projects/services",
    label: "View services",
  },
];
