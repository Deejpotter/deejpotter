# Coolify + Tunnel Migration Todo

## Goal
Move the Deej Potter site and future sub-apps under a Coolify-managed host on this PC, then point Cloudflare at that single Coolify entrypoint.

## Why this path
- Coolify is better than a plain local Next.js process because it handles deploys, restarts, logs, env vars, and app routing.
- The official Coolify docs want Linux + Docker Engine, so WSL2 Ubuntu is the safest host on this Windows machine.
- Cloudflare Tunnel should point to one Coolify dashboard origin, and Coolify/Traefik can route the subdomains internally.

## Plan

### 1. Establish the Coolify host in WSL2
- Verify Ubuntu 22.04 WSL2 is available and can run Docker.
- Use the root WSL session for installation because the Coolify installer needs elevated privileges.
- Install Coolify with the official quick-install script.
- Confirm the dashboard comes up on port 8000.

#### Logic
Coolify is Linux-first. Installing it in the already-running Ubuntu WSL2 instance avoids a second machine and avoids the unreliable Windows Docker-desktop hosting path.

### 2. Confirm the Docker / Coolify runtime is healthy
- Check Docker version and the Docker socket inside WSL.
- Verify Coolify containers start cleanly.
- Make sure the dashboard, proxy, and realtime ports are reachable from Windows localhost.

#### Logic
If the Docker version is the thing that previously caused trouble, this is where it will surface. Better to catch it before moving DNS.

### 3. Register the Deej Potter app inside Coolify
- Add the existing Next.js app as a Coolify service.
- Point the app at the current repo or a build/start command that matches the existing Next.js production flow.
- Verify the app is reachable locally inside the Coolify network.

#### Logic
This turns the site from a hand-run local process into something Coolify can supervise properly.

### 4. Move the public domains to the single Coolify tunnel
- Update the Cloudflare tunnel so the public host points to the Coolify dashboard/origin.
- Remove the old direct tunnel routing for the individual app ports once Coolify owns them.
- Keep a fallback note of the old port mapping while we transition.

#### Logic
One tunnel to Coolify is simpler than one tunnel per app. Coolify can then own the subdomain routing internally.

### 5. Recreate the sub-apps in Coolify
- Add `deejpotter.com`.
- Add `coolify.deejpotter.com`.
- Add any future app subdomains as separate Coolify-managed services.

#### Logic
This is the long-term payoff: one host, many apps, less manual tunnel work.

### 6. Validate end-to-end access
- Test Coolify dashboard access.
- Test `deejpotter.com`.
- Test `coolify.deejpotter.com`.
- Test at least one existing sub-app path after the tunnel switch.

#### Logic
Routing mistakes usually hide until a real browser request hits them. End-to-end tests catch those fast.

### 7. Clean up and document
- Record the final ports, hostnames, and service names.
- Remove obsolete direct-routing notes.
- Update memory with the final architecture.

#### Logic
If this setup works, the next time it breaks we should be able to reconstruct it in minutes, not hours.

## Sub-task checklist
- [ ] Install Coolify in WSL2 Ubuntu as root
- [ ] Confirm Coolify dashboard on port 8000
- [ ] Confirm Docker version and container health
- [ ] Add Deej Potter app to Coolify
- [ ] Switch Cloudflare tunnel to Coolify
- [ ] Add `deejpotter.com` and `coolify.deejpotter.com`
- [ ] Test the public routes
- [ ] Save the final config and architecture notes
