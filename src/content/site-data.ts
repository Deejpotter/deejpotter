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
      "Practical websites, landing pages, portfolio sites, and redesigns built to be clear, responsive, and easy to maintain.",
    features: [
      "Small business websites",
      "Portfolio and personal brand sites",
      "Landing pages and lead-generation pages",
      "Redesigns and technical improvements",
    ],
    link: "/projects/services/website-design",
    cta: "Start a website project",
  },
  {
    id: "website-redesign",
    name: "Website Redesign",
    description:
      "A focused service for improving sites that already exist but need clearer messaging, better structure, or stronger enquiry flow.",
    features: [
      "Design refreshes",
      "Better mobile responsiveness",
      "Stronger calls to action",
      "SEO and content structure improvements",
    ],
    link: "/projects/services/website-redesign",
    cta: "Ask about a redesign",
  },
  {
    id: "custom-tools-automation",
    name: "Custom Tools and Automation",
    description:
      "Purpose-built calculators, internal tools, and workflow helpers for situations where off-the-shelf software is not quite right.",
    features: [
      "Custom calculators",
      "Small internal utilities",
      "Operational workflow helpers",
      "Automation for repetitive digital tasks",
    ],
    link: "/projects/services/custom-tools",
    cta: "Ask about a custom tool",
  },
  {
    id: "3d-printing",
    name: "On-Demand 3D Printing",
    description:
      "On-demand 3D printing for prototypes, replacement parts, hobby projects, and small-run functional pieces around Frankston and the Mornington Peninsula.",
    features: [
      "Prototype and replacement parts",
      "Small-run functional prints",
      "Viable next-day local turnaround",
      "Planned STL upload and quoting workflow",
    ],
    link: "/projects/services/3d-printing",
    cta: "Get 3D printing details",
  },
  {
    id: "cad-cam-fabrication",
    name: "CAD, CAM, and Fabrication Support",
    description:
      "CAD/CAM prep, machine-ready files, and light fabrication support for 3D printing, laser work, and basic milling - with honest limits around the Snapmaker A250T 2.0.",
    features: [
      "CAD models and file prep",
      "CAM and toolpath setup",
      "Basic laser and milling work",
      "Local delivery or home visits within about an hour drive",
    ],
    link: "/projects/services/cad-cam-fabrication",
    cta: "Talk about fabrication",
  },
];
export const processSteps: ProcessStep[] = [
  {
    id: "discover",
    title: "Discover the real problem",
    description:
      "We start with a clear brief, the current pain points, and the outcome you actually want rather than the first idea that comes to mind.",
  },
  {
    id: "structure",
    title: "Shape the structure",
    description:
      "I map the content, workflow, and navigation so the project has a solid skeleton before the detail work begins.",
  },
  {
    id: "build",
    title: "Build the working version",
    description:
      "I implement the site or tool with practical code, clean behaviour, and enough polish to feel deliberate instead of improvised.",
  },
  {
    id: "refine",
    title: "Refine and hand over",
    description:
      "Then I tighten the copy, accessibility, and responsiveness so the finished piece is easy to use and easy to continue improving.",
  },
];

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "website-projects",
    title: "Website projects",
    description:
      "See the portfolio work, redesign thinking, and other public-facing sites that I have built.",
    link: "/projects/websites",
    label: "Browse websites",
  },
  {
    id: "tools",
    title: "Technical tools",
    description:
      "Calculators, workflow helpers, and problem-solving utilities for real operational tasks.",
    link: "/projects/tools",
    label: "Explore tools",
  },
  {
    id: "services",
    title: "Services",
    description:
      "A direct summary of the kinds of work I take on and how I like to approach it.",
    link: "/projects/services",
    label: "View services",
  },
];
