# Duck Pond — v1.1.1

## v1.0.3 – Smart TV stability

- Uses classic transform-based pond positioning on detected TV browsers to reduce jitter.
- Keeps swimming prestige stars aligned to the 512×512 duck canvas on legacy TV engines.
- Disables Gangnam and duck fights on TV browsers because older Web Animations implementations can abort those sequences mid-event.
- Modern phone/desktop browsers retain all existing interactions and performance paths.


Duck Pond is the Taipans Cricket Club weekly duck animation. Player and duck data are loaded from CSV files and rendered as an interactive pond for desktop and mobile browsers.

## Production files

- `index.html` — application shell and cache-busted references
- `src/app.js` — pond behaviour, player/week logic and events
- `src/styles.css` — layout, animation and responsive styling
- `data/players.csv` — player presentation data
- `data/ducks.csv` — weekly duck events
- `assets/` — production artwork and sound
- `docs/` — design decisions, backlog, roadmap and release/security notes

## Data format

`data/players.csv`

```text
playerId,name,nickname,presentation,featherTone,build,president,captain,coach,hair,headwear,swimAccessory
```

`data/ducks.csv`

```text
date,playerId,team,duckType
```

Supported `duckType` values are `standard`, `golden` and `diamond`. Dates may be supplied as `D/M/YYYY`, `DD/MM/YYYY` or `YYYY-MM-DD`.

## Club-week behaviour

The season is anchored to **28 Sep–4 Oct 2026**. Empty/washout weeks remain selectable. When duck data exists, the latest populated club week is selected by default.

## Hosting

The production build is suitable for static hosting on GitHub Pages. Treat everything committed to a public production repository, including CSV data and assets, as publicly accessible.

## v1.0.0 release

v1.0.0 is the production launch build promoted directly from the tested v0.183 release candidate. It includes the completed pre-release cleanup plus mobile portrait pond-scroll hints and the Facebook/Instagram in-app-browser landscape notice. No functional pond changes were made during the v1.0.0 promotion.


## v1.0.1 compatibility release

- Transpiles modern JavaScript syntax for older smart-TV browser engines.
- Adds small DOM/JavaScript compatibility fallbacks required by older browsers.
- Detects common smart-TV browsers and automatically enters a TV display mode after the selected week loads.
- TV mode hides normal page chrome and leaves a remote-friendly **Change week** control to return to the selector.
- The default remains the latest populated club week.
- No duck, animation, asset, CSV or scoring behaviour changed from v1.0.0.

## Release notes

v1.0.4 improves TV startup/display behaviour. Detected TV browsers enter full-pond display mode immediately, show the loading pond overlay while production data/assets are prepared, then begin the newest-week entry sequence without waiting for all ducks to finish entering. The non-working TV Change Week control has been removed. Modern phone/desktop behaviour is unchanged.


## v1.0.6

- Rebuilt directly from known-good v1.0.4.
- Added Hisense / VIDAA / Odin detection only for TV display mode.
- Hisense enters full-pond TV display mode immediately at startup.
- Existing v1.0.4 rendering and legacy-TV compatibility logic is unchanged.
- No CSS, assets or CSV data changed.


## v1.0.7

- Added deterministic TV display mode via `?tv=1`.
- A forced TV display choice is remembered in local storage for future visits on that browser.
- `?tv=0` clears the remembered TV display choice and disables TV display mode for that load.
- Existing v1.0.6 rendering and legacy-TV compatibility logic is unchanged.
- No CSS, assets, or CSV data changed.


## v1.1 production promotion

- Promoted from the tested puddledev v1.0.7 build.
- Includes the tested smart-TV display-mode CSS that was missing from the earlier production upload.
- `?tv=1` forces TV display mode and remembers it for that site/browser.
- No duck behaviour, animation or data changes were introduced during promotion.


## v1.1.1

- TV display mode now attempts to initialise and resume pond audio automatically at startup.
- Phone and laptop audio behaviour is unchanged and still unlocks on user interaction.
- Some TV/browser engines may still enforce autoplay restrictions at the browser level.
