/**
 * The project list behind the home page. One typed array so adding a project
 * is a data change, not a layout change.
 *
 * Only public repos get a `repo` link. Private projects are still listed so
 * the page shows the work, but never link to their instances: those run on
 * personal subdomains that shouldn't be advertised.
 */
export type ProjectStatus = "live" | "in progress" | "archived";

export type Project = {
  id: string;
  name: string;
  summary: string;
  stack: string[];
  status: ProjectStatus;
  repo?: string;
  live?: string;
  /** A page on this site: a write-up, tool or game. */
  page?: string;
  /** Featured projects get the large tiles at the top of the grid. */
  featured?: boolean;
};

const gh = (repo: string) => `https://github.com/Deejpotter/${repo}`;

export const projects: Project[] = [
  {
    id: "game-agent",
    name: "Game Agent",
    summary:
      "An autonomous agent that plays Game Boy Advance games around the clock through mGBA and a local vision model.",
    stack: ["Python", "mGBA", "Local LLM"],
    status: "in progress",
    repo: gh("game-agent"),
    featured: true,
  },
  {
    id: "day-planner",
    name: "Day Planner",
    summary:
      "A self-hosted planner for tasks, habits and the week ahead, with its own auth and API keys.",
    stack: ["TypeScript", "Next.js", "Better Auth"],
    status: "in progress",
    featured: true,
  },
  {
    id: "cyd-air-monitor",
    name: "CYD Air Monitor",
    summary:
      "Air quality monitor on the ESP32 \"Cheap Yellow Display\", with an LVGL touchscreen UI.",
    stack: ["C++", "ESP32", "LVGL", "PlatformIO"],
    status: "live",
    repo: gh("cyd-air-monitor"),
    featured: true,
  },
  {
    id: "cnc-tools",
    name: "CNC Tools",
    summary:
      "A dozen calculators for CNC and extrusion work, built for answering customer questions fast.",
    stack: ["TypeScript", "Next.js"],
    status: "live",
    repo: gh("cnc-tools"),
    live: "https://onlinecnctools.netlify.app",
  },
  {
    id: "idle-minds",
    name: "Idle Minds",
    summary: "A browser autobattler built with Phaser.",
    stack: ["JavaScript", "Phaser"],
    status: "in progress",
    repo: gh("idle-minds"),
  },
  {
    id: "grocery-visualiser",
    name: "Grocery Visualiser",
    summary:
      "Meal plans, shopping lists and supermarket spend from order history, in one small self-hosted app.",
    stack: ["Python", "Flask", "SQLite"],
    status: "live",
    repo: gh("groceries-spend-visualiser"),
  },
  {
    id: "online-emu",
    name: "Online Emu",
    summary: "A self-hosted retro game emulator built on EmulatorJS.",
    stack: ["TypeScript", "EmulatorJS", "Docker"],
    status: "live",
    repo: gh("online-emu"),
  },
  {
    id: "cyd-grbl-controller",
    name: "CYD GRBL Controller",
    summary:
      "A touchscreen controller template for GRBL actuators on the same ESP32 board.",
    stack: ["C", "ESP32", "LVGL"],
    status: "in progress",
    repo: gh("cyd-grbl-controller"),
  },
  {
    id: "esp32-wireless-car",
    name: "ESP32 Wireless Car",
    summary:
      "A wireless RC car with dual motor control and encoder feedback, driven from a handheld controller.",
    stack: ["C", "ESP32"],
    status: "archived",
    repo: gh("esp32-wireless-car"),
    page: "/projects/engineering/wireless-car",
  },
  {
    id: "simple-drawbot",
    name: "Simple Drawbot",
    summary:
      "Desktop app that turns drawings, text and images into G-code for pen plotters.",
    stack: ["Python"],
    status: "archived",
    repo: gh("simple-drawbot-software"),
  },
];
