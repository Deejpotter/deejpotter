import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const port = new URL(baseURL).port || "3000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30 * 1000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10 * 1000,
    baseURL,
    launchOptions: {
      args: ["--disable-gpu"],
    },
  },
  webServer: {
    command: `yarn dev -- -p ${port}`,
    url: baseURL,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: '',
      NODE_ENV: 'development'
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
