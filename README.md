# Taipan Pond v0.62

## v0.62 — Asset Preload / First-Run Fix

Built directly on v0.61.

### Changes
- Preloads and decodes all 99 currently used production PNGs before duck controls are enabled.
- Keeps strong in-memory references to the decoded images for the lifetime of the page, targeting first-use flashes and sprite lag seen on GitHub Pages.
- Covers all current walk frames, swim bodies, faces/blinks, wings, wakes, splash cells, normal/leader/crown headwear, coach whistle assets and scene layers.
- Duck controls show a loading state and remain disabled if a required production image fails to load/decode, rather than starting an incomplete animation.
- Fixed the swimming captain **C** layer so it stays above the front wing and remains visible in the water.

### Preserved from v0.61
- Multiple captains/coaches and stacked roles.
- President crown and white President duck.
- Leader cap and headwear priority: **President crown > leader cap > normal TCC cap**.
- Maximum of three yellow-feather ducks in the `Load 60` test population.
- Scene geometry, pier and mobile behaviour.
- Swimming movement, turning, wakes and collision interactions.
- Feather colours and body-build variants.
- Idle blinks, double blinks, wing flicks and varied bob timing.
- Mobile click-reaction fix.

### Hosted testing note
For the first GitHub Pages test, use a private/incognito window or clear site data so the browser starts with a genuinely cold image cache. The duck controls should not unlock until the sprite preload/decode pass has completed.
