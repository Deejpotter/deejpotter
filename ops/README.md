# deejpotter deployment ops

## Purpose
This app is deployed without Coolify using:
- separate deploy clones for each branch/environment
- PM2 for runtime process management
- one app per branch/environment

## Environment mapping
- `main` -> production -> `deejpotter-prod` -> port `3000`
- `dev` -> staging -> `deejpotter-staging` -> port `3001`

## Why deploy clones
A single checkout cannot cleanly represent both `main` and `dev` live at the same time.
Separate deploy clones preserve your branch-based workflow while allowing production and staging to run simultaneously.

## Commands
### Create/update both deploy clones
```powershell
.\ops\setup-deploy-clones.ps1
```

### Deploy production
```powershell
.\ops\deploy-branch.ps1 -Branch main
```

### Deploy staging
```powershell
.\ops\deploy-branch.ps1 -Branch dev
```

## PM2 ecosystem
The PM2 ecosystem file is at:
- `ops/pm2/ecosystem.config.cjs`

Default deploy root:
- `C:\Users\deej\deploy`

Override with env var:
- `DEEJPOTTER_DEPLOY_ROOT`

## Runtime expectation
The deploy script:
1. updates the branch-specific deploy clone
2. runs `yarn install --frozen-lockfile`
3. runs `yarn build`
4. reloads the matching PM2 app

PM2 runs:
- `yarn start`
