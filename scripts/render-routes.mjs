/**
 * Writes render.yaml from public/_redirects.
 *
 * Render static sites don't read _redirects (that's the Cloudflare Pages and
 * Netlify format), so the same rules have to be listed as routes in the
 * Blueprint, once per service. Generating them keeps one source of truth:
 * edit public/_redirects, then run `node scripts/render-routes.mjs`.
 * A test fails if the two drift apart.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Parses `source destination [code]` lines, skipping comments and blanks. */
export function parseRedirects(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [source, destination] = line.split(/\s+/);
      // _redirects names the captured wildcard :splat; Render reuses * itself.
      return { source, destination: destination.replace(":splat", "*") };
    });
}

// Staging follows dev and production follows main, the same split the old
// web services used, so changes are checked on staging before they go live.
const services = [
  { name: "deejpotter-static-staging", branch: "dev", domain: "staging.deejpotter.com" },
  { name: "deejpotter-static", branch: "main", domain: "deejpotter.com" },
];

export function renderYaml(rules) {
  const routes = rules
    .map(
      (r) =>
        `      - type: redirect\n        source: "${r.source}"\n        destination: "${r.destination}"`,
    )
    .join("\n");

  const header = `# Render Blueprint for deejpotter.com as free static sites.
# GENERATED from public/_redirects by scripts/render-routes.mjs; edit that
# file and re-run the script instead of editing the routes here.
#
# Staging builds dev and production builds main. Custom domains are added in
# the dashboard during the cut-over (docs/PERSONAL_SITE_PLAN.md, section 6),
# not here, so creating the services doesn't take deejpotter.com off the old
# web service.
services:`;

  const blocks = services.map(
    (s) => `  # ${s.domain}
  - type: web
    name: ${s.name}
    runtime: static
    branch: ${s.branch}
    autoDeployTrigger: commit
    buildCommand: yarn install --frozen-lockfile && yarn build
    staticPublishPath: ./out
    routes:
${routes}`,
  );

  return `${header}\n${blocks.join("\n")}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rules = parseRedirects(readFileSync(path.join(root, "public/_redirects"), "utf8"));
  writeFileSync(path.join(root, "render.yaml"), renderYaml(rules));
  console.log(`render.yaml: ${rules.length} routes x ${services.length} services`);
}
