# Live cut optimiser demo on the home page

**Date:** 2026-11-05
**Investigator:** Claude Code
**Status:** Done. Live on staging (#177) and production (#178).

## 1. What was asked

Think of three improvements, pick the most useful, plan it, build it, then ship through staging to production with tests at each step.

## 2. What was checked

- `.github/TODOs.md`, the home page, the project list and the tools.
- The linear cut optimiser's API (`calculateOptimalCuts`) and its bar visualisation.

## 3. Options considered

| Option | Verdict |
| --- | --- |
| Live cut optimiser demo on the home page | **Chosen.** First item on the "show-off ideas" list. Every visitor sees a real tool working, and it reuses tested code. |
| Mobile layout pass (TODO 7) | Mostly checking, not improving. The new section was checked at 375px anyway. |
| Write-up pages for Game Agent and CYD boards | Needs facts only Deej has. Writing them now would mean inventing details. |

## 4. What was changed

- New `src/components/home/CutDemo.tsx`: three editable cut rows, a stock length choice (1000, 1500, 3000 mm), 3 mm kerf. It reruns the real optimiser on each edit and shows the bars, stock used, utilisation and leftover. Errors (such as a cut longer than the stock) show in an alert. It links to the full calculator.
- New "Try one" section on the home page, between Projects and "Also on this site".
- Home test covers the starting plan, replanning on stock change, the too-long error and the link.
- `.github/TODOs.md`: demo item ticked; the CYD screen mock stays open.

## 5. Evidence and wrong turns

- The first starting cuts (4 × 600, 6 × 450, 5 × 300) needed 6 lengths at 74% used. The test's comment had assumed 5. The starting cuts were changed to 4 × 700, 6 × 400, 4 × 350, which fit 5 lengths at 88% and show the packing better.
- The first staging check matched "Try one" in the 404 page's text ("Try one of these instead"), so it reported the deploy live too early. The check was changed to look for `id="try-it"`.
- One overflow reading on staging was wrong because the browser pane had collapsed to 0 px wide. A fixed 375px viewport showed no overflow.

## 6. What was deliberately not changed

- The optimiser itself. The demo calls it as is.
- Stock is fixed at 50 pieces and quantities are capped at 30, so the demo can't be asked for an unbounded plan.

## 7. Verification

- Local: types clean, lint 0 errors and 4 warnings, 119 of 119 tests, build clean. Static export checked at 375px (no sideways scroll) and 1280px (two columns, no overflow). The screenshot at 1280px timed out because the app window was hidden, so that check used layout measurements only.
- Staging and production: starting plan "5 × 1500 mm lengths, 88% used", switching to 3000 mm gave "3 × 3000 mm lengths, 74% used", a 4000 mm cut showed the error, the link goes to the full calculator, no overflow at 375px, no console errors.

## 8. Open items

1. CYD screen mock, the other demo idea.
2. Write-up pages for Game Agent and CYD, once Deej supplies the details.

## 9. Commands to reproduce

```powershell
Set-Location 'C:\Users\deejp\repos\deejpotter'
npx vitest run src/__tests__/home.test.tsx
npx next build
npx serve out -l 4517
```
