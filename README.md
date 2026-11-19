# Vice Trophy Guide — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/agusdona/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/agusdona/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI trophies on PlayStation 5** — 1 platinum, 2 gold, 6 silver, 46 bronze — built for the [make.fun gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01).

Every trophy is shown with its **official name, description and grade** as PlayStation publishes them (via Exophase and PSNProfiles), plus a guide written in our own words that **cites its sources** beside the trophy, a five-stage **roadmap to the platinum**, and **missable flags** built from the official descriptions. The tracker saves your progress in the browser, exports and imports it as JSON, filters by kind, grade and status, and has a **spoiler setting** that hides story trophies until they are earned.

GTA 6 released 19 November 2026. Where no trusted post-release guide exists yet for a trophy, its guide says so plainly instead of inventing a location or a step. No Rockstar logo or official artwork is used anywhere.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

The app is plain static files under `app/` — no build step, no network at run time. Open `app/index.html` in any desktop browser with the files served (for example with `node serve.ts`).

## Hand it in (the entry program)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` there with the vendored `buildDossier` library.

## Layout

- `app/index.html` — the page: progress, filters, roadmap, missable list, checklist, detail panel
- `app/style.css` — the whole look, built from scratch
- `app/app.js` — boot: loads the data, wires the controls, keeps the views in sync
- `app/storage.js` — progress in localStorage, plus export and import of the JSON file
- `app/roadmap.js` — the five roadmap stages and the missable list, from the official descriptions
- `app/trophy-list.js` — checklist rendering, filters, spoiler hiding, detail panel
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, kind, missable flag, roadmap stage, steps and sources
- `screenshots/` — four real browser renders of the guide (the first by name is the cover)
- `shots.json` — which view each screenshot was taken of
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
