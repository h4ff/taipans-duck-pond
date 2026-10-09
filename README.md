# Duck Pond — v0.179

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

## Release note

v0.179 aligns the three swimming Golden/Diamond prestige stars to fixed points measured from the approved 512×512 swim-art coordinate system. Walking prestige and movement trails are unchanged.
