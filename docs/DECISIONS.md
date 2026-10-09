# Locked Decisions

## Product

Duck Pond is a data-driven interactive weekly animation for Taipans Cricket Club. New ducks enter for the selected club week and previous ducks remain in the pond.

## Production data

- `data/players.csv` stores player presentation data.
- `data/ducks.csv` stores weekly duck events.
- The public site contains no confidential data; repository and CSV contents are treated as public.
- Club weeks run Monday–Sunday and the 2026/27 season is anchored to 28 Sep–4 Oct 2026. Empty/washout weeks remain valid.

## Visual/behaviour locks

- 16:9 pond world with pavilion right, scoreboard left and pier entering front-left.
- Previous rounds persist in the pond; current-week ducks enter via the pier.
- Golden/Diamond prestige uses low-cost sparkle effects; movement trails remain part of the prestige identity.
- President crown overrides caps; leader/player headwear and role overlays follow the established priority rules.
- Fight selection uses double tap/click.
- Mobile expanded pond and landscape behaviour remain production-supported.

## Performance

- Pond swimming uses transform-based visual positioning.
- Avoid blanket low-frame-rate throttling; v0.163 proved visually worse and is not part of the production baseline.
- Avoid expensive multi-particle prestige fields or broad CSS filter/compositor hints on every duck.

## Release discipline

- Increment the version for every changed build.
- Keep production changes defect-only around release.
- Test feature work in a separate development repository after v1.0.
