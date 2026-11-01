# Games page: Dungeon Crawl, Basic Bases and Geek Pride removal

**Date:** 2026-11-01
**Investigator:** Claude Code
**Status:** Partly done. Dungeon Crawl and the Geek Pride removal are live on production. The new Basic Bases is not shipped.

## 1. What was asked

1. Improve the games page so it has the new Basic Bases and the Unity version of Dungeon Crawl.
2. Test, merge to dev, verify staging, merge to main.
3. Track the work in Day Planner under the project and tick off each task.
4. Mid-task: pack up, merge to main and write this post-mortem.
5. Mid-task: "That geek pride page should not be there."

## 2. What was checked

- The games page, the Basic Bases and Dungeon Crawl pages, sitemap, redirects and `render.yaml`.
- Branch state: `dev` and `main` had diverged, with 21 commits on `dev` not on `main`.
- Day Planner tasks and docs for the project, including the Unity project inventory of 2026-10-20.
- `krasus` investigations for Basic Bases, on this PC and in the old drive archive.
- For the Basic Bases source: `C:\Users\deejp`, `D:\Backups\old-drive-archive`, the 24 Oct OpenClaw backup, and a search of C: and D: for `BasicBasesProjectSetup.cs` and for Unity projects.
- Every Geek Pride URL on staging and production, in the browser.

## 3. What the evidence showed

### Dungeon Crawl

It was already on `dev` through #164. PR #165 put it on `main` at 20:30 while this work was running. That PR did not come from this session. It was probably the `dungeon-crawl-unity` session, but that is unverified.

### Basic Bases

- **The new version could not be shipped because its source is missing.** The rebuild was recorded at `C:\Users\Deej\Unity\projects\BasicBases-Recovered`. That user folder no longer exists and the project was not found anywhere searched. The search did not establish whether G: holds a copy; that part of the check was not reviewed.
- **Still available:** the raw recovered assets at `D:\Backups\old-drive-archive\Repos\krasus\tmp\basic-bases-recovery\RecoveredProject\ExportedProject`. These have art and the font but no working scripts. Also `Repos\krasus\tmp\basic-bases-webgl-candidate`, screenshots, logs, and the reverted WebGL commits in git (`1b91f4e` to `4164e40`).
- **The reverted WebGL builds are not an option.** The 20 Oct investigation records a startup failure on staging. They were not retested here.
- **Editor version:** Only Unity 6000.6.7f1 is installed. Unity 2022.3.32f1, used for the rebuild, is not.
- **The earlier verdict still stands.** Deej said the replacement did not resemble the original, and a faithful gameplay review was still required before publishing.

### Geek Pride Day

The 20 Oct removal was incomplete.

| Where | Before this work |
| --- | --- |
| Production `/projects/games/geek-pride-day/` | **Old game page still served** (200, 30 KB) |
| Staging `/projects/games/geek-pride-day/` | Old game page still served |
| Staging `/geek-pride-day/` | Old game still served |
| Staging `/downloads/geek-pride-day-prototype.zip` | 10 MB zip still served |
| Source sitemap on `main` and `dev` | Page still listed, and a test required it |

- **Cause:** Render keeps files from earlier deploys, and a stale file wins over a redirect rule. The 20 Oct fix covered `/geek-pride-day/` and the zip, but not the `/projects/games/` path. It also only reached `main`, so staging never got it.

### Hypotheses

| Hypothesis | Outcome |
| --- | --- |
| The new Basic Bases is in the Unity project on this PC | False. `My project` is an untouched template |
| The rebuild survived in the archive | False. Only the raw export is there |
| The Geek Pride problem was only the sitemap entry | False. The old game was still being served |
| Deleting a page from source removes it from Render | False. The stale file stays until it is overwritten |
| `feat/dungeon-crawl-main` still needed merging | False. #165 had already merged it |

## 4. What was changed

- **PR #166 into `dev`:** merged `main` into `dev` and fixed the Geek Pride paths. Dependency conflicts kept the newer of each version: next 16.3.8 and lucide-react 1.49.0.
- **PR #167 into `main`:** added `public/projects/games/geek-pride-day/index.html`, which overwrites the stale file. Added redirects for the path to `public/_redirects`, and regenerated `render.yaml`. Removed the sitemap entry and made its test assert the page is absent.
- **Day Planner:** added tasks and this post-mortem under `deejpotter`.
- **Local machine:** installed yarn globally with npm, as it was missing. `node_modules` was installed in this checkout with `--ignore-engines` because this PC runs Node 26 and the repo asks for Node 24.

## 5. What was deliberately not changed

- **Basic Bases stays on the old public build.** Nothing broken or unreviewed was published.
- **No rebuild was started.** Deej asked to pack up, and Basic Bases already needs Deej's review for faithfulness.
- **The stub pages stay.** They are what stops Render serving the stale files, so they must not be deleted. Visitors get a brief "Project unavailable" page and then land on Games.
- **Dependabot PRs and the 21 reported vulnerabilities were not touched.**
- **The games page layout and copy were not redesigned.** The only change to the page itself is the Dungeon Crawl card from #164 and #165.

## 6. Verification

- **Gate on both branches:** lint 0 errors and 4 warnings, 114 of 114 tests passing, build clean, no Geek Pride in the exported sitemap.
- **Staging after #166:** every Geek Pride URL shows "Project unavailable", the browser then lands on Games, and the zip is 0 bytes. The sitemap is clean.
- **Production after #167:** the same results. Games lists Basic Bases and Dungeon Crawl with no Geek Pride.
- **Dungeon Crawl:** the title screen loaded in the browser on both staging and production. Page, build and card image return 200. A full playthrough was **not** done in this work.
- **Not checked:** deploy records in Render, because no Render workspace is selected. Live behaviour was checked instead. The single 404 in the console was not traced to a URL.

## 7. Open items

1. Find or rebuild Basic Bases. Check G: and any old PC first. Otherwise rebuild it in Unity 6 from the raw assets, then have Deej review it before it goes to staging.
2. Add `public/images/games/basic-bases.jpg`. It returns 404 on production, so the Basic Bases card shows a broken image.
3. Play Dungeon Crawl through and test the APK. Those two Day Planner tasks stay open for Deej.
4. Align `dev` and `main`. `dev` still has 21 commits `main` lacks, and `main` has one merge commit `dev` lacks.
5. Review the 21 GitHub vulnerability alerts (3 critical, 5 high).
6. Update stale paths. Docs still point at `C:\Users\Deej`. This PC uses `C:\Users\deejp`.

## 8. Commands to reproduce

```powershell
Set-Location 'C:\Users\deejp\repos\deejpotter'
npx yarn@1.22.22 install --frozen-lockfile --ignore-engines
npx eslint . --ext .ts,.tsx,.js,.jsx
npx vitest run
npx next build
node scripts/render-routes.mjs
```

Open these in a browser. Each should end on the Games page:

- https://deejpotter.com/projects/games/geek-pride-day/
- https://deejpotter.com/geek-pride-day/
