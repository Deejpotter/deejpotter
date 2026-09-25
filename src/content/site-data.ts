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
      "Websites for small businesses and personal projects. Built by hand, quick to load, and easy to update.",
    features: [
      "Small business and portfolio sites",
      "Landing pages",
      "Redesigns of sites that feel outdated",
      "Clean code any developer can pick up later",
    ],
    link: "/projects/services/website-design",
    cta: "Start a website",
  },
  {
    id: "custom-tools-automation",
    name: "Custom Tools and Automation",
    description:
      "Calculators, dashboards, and small tools for the jobs off-the-shelf software doesn't quite handle.",
    features: [
      "Pricing and quoting calculators",
      "Dashboards and admin tools",
      "Automating repetitive tasks",
      "Imports, exports, and reports",
    ],
    link: "/projects/services/custom-tools",
    cta: "Ask about a tool",
  },
  {
    id: "3d-printing",
    name: "3D Printing",
    description:
      "Upload a model, check it in 3D, and get a price straight away. Good for prototypes, replacement parts, and small runs.",
    features: [
      "Instant quote from your STL file",
      "3D preview before you send it",
      "PLA and PETG",
      "Pickup or delivery around Frankston",
    ],
    link: "/projects/services/3d-printing",
    cta: "Get a quote",
  },
  {
    id: "cad-cam-fabrication",
    name: "CAD, CAM, and Fabrication",
    description:
      "Laser engraving, CNC milling, and CAD work. Send me a sketch or an idea and I'll turn it into a real part.",
    features: [
      "Laser engraving on wood and acrylic",
      "CNC milling for signs, panels, and parts",
      "CAD models from sketches or photos",
      "DXF and SVG upload with a live preview",
    ],
    link: "/projects/services/cad-cam-fabrication",
    cta: "Ask about fabrication",
  },
];
export const processSteps: ProcessStep[] = [
  {
    id: "brief",
    title: "Tell me what you need",
    description:
      "Send a short brief: the problem, the deadline, and what done looks like. I'll tell you straight whether I can help and roughly what it'll cost.",
  },
  {
    id: "build",
    title: "I build it",
    description:
      "You'll see progress as I go, and if something needs changing, we change it.",
  },
  {
    id: "deliver",
    title: "You get the finished thing",
    description:
      "A working site, a part that fits, or a tool that does the job, plus notes on how to use it.",
  },
];

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "website-projects",
    title: "Website projects",
    description:
      "Small business sites, portfolios, and redesigns.",
    link: "/projects/websites",
    label: "Browse websites",
  },
  {
    id: "tools",
    title: "Custom tools",
    description:
      "Calculators, workflow helpers, and small tools that save manual work.",
    link: "/projects/tools",
    label: "Explore tools",
  },
  {
    id: "services",
    title: "All services",
    description:
      "Websites, custom tools, 3D printing, laser engraving, and CNC milling.",
    link: "/projects/services",
    label: "View services",
  },
];
