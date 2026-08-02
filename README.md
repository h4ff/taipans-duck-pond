# Taipan Pond — Stress Test v0.39

This remains a technical test build. It is not the v1.0 UAT candidate.

This version uses the cleaned foreground assets supplied by the user and removes the duplicate foreground-right-bank overlay.

## New in v0.12

### Separate foreground assets

The failed full shoreline ring has been removed. The scene now uses:

- `scene-background.png`
- `foreground-near-bank.png`
- `foreground-reeds.png`
- `pier-foreground.png`

The ducks sit between the base scene and those genuine foreground objects.

### Live scoreboard

The illustrated scoreboard now has a live overlay showing:

- total ducks in the pond;
- placeholder top-three duck getters.

Click the physical scoreboard to open a larger scoreboard panel.

Lead-duck medal markers have been removed for this build.

### Population stress controls

Use the toolbar to instantly load:

- 10 ducks
- 25 ducks
- 50 ducks
- 60 ducks

The test population is distributed around the navigable water area.

### Movement throttling

Only a limited percentage of the pond swims at once:

- minimum 4 active swimmers;
- maximum 10 active swimmers;
- approximately 15% of the current population.

This keeps a 50–60 duck pond alive without making every duck move simultaneously.

### Expression registration

The sad sprite has been shifted slightly down and right to counter the remaining
up-left jump seen during click reactions.

## What to test

- Is 50 or 60 ducks funny-crowded rather than unusable?
- Does performance remain acceptable?
- Can individual ducks still be clicked?
- Do the separate foreground assets occlude ducks naturally?
- Is the live scoreboard useful and readable?

## Still future work

- Proper directional and waterline duck artwork.
- Natural turning.
- Collision and bump reactions.
- Real player/round data.
- Final scoreboard design.
- Removal of all developer controls before v1.0.


## v0.14 asset-only update

No movement, pond-boundary, scoreboard, population, interaction, or layout code was changed.

Updated assets supplied by the user:

- `duck-angry.png`
- `duck-sad.png`
- `foreground-reeds.png`
- `pier-foreground.png`

This fixes the opaque-eye issue and small foreground cut-out errors while preserving the known-good v0.13 behaviour.


## v0.15

Targeted layout and depth update:

- removed the scene min-height that distorted the pond in mobile emulation;
- made duck body size responsive to scene width so ducks do not become oversized on narrow screens;
- tightened pier avoidance by replacing the oversized rectangular obstacle with a smaller polygon matching the pier footprint more closely;
- split the pier foreground behaviour into:
  - `pier-legs-depth` (mid-depth)
  - `pier-deck-foreground` (front-most)

This version is intended to improve:
- mobile alignment of ducks to the pier;
- how closely ducks can swim to the pier edge;
- cases where a foreground duck should appear in front of the pier legs.


## v0.16

Pier-position correction without reverting the v0.15 mobile work.

The pier now has two independent invisible zones:

- **Travel obstacle:** a tight polygon matching the timber footprint. Ducks can still route around the end of the pier and pass behind it.
- **Resting buffer:** a wider destination-only polygon. Ducks cannot stop with their centre so close that their hat or body visibly straddles the deck.

The v0.15 responsive 16:9 layout, responsive duck sizing and split pier-leg/deck depth treatment are retained.


## v0.17

Pier rendering correction:

- removed the two clipped duplicate pier overlays introduced in v0.15;
- restored a single complete pier asset;
- placed the pier at z-index 880 within the same depth scale used by swimming ducks;
- ducks at approximately y <= 78 render wholly behind the pier;
- ducks at approximately y >= 79 render wholly in front of the pier;
- entry ducks retain their temporary high z-index while walking across the deck.

This removes the floating-head effect caused by the clipped deck overlay.


## v0.18

Small pier-spacing tweak only.

- Kept the v0.17 single depth-sorted pier layer.
- Kept the separate travel obstacle and resting buffer logic.
- Reduced the **near-side / front-edge resting buffer** so ducks can sit noticeably closer to the visible pier.
- Left the **far-side / behind-pier protection** in place to avoid half-hidden resting positions.

No asset, scaling, scoreboard, or interaction changes were made.


## v0.19

Further tightened the **near-side/front-edge** pier resting buffer.

- Ducks can now stop noticeably closer to the front edge of the pier.
- The far-side / behind-pier protection remains in place.
- The single-pier depth rendering from v0.17 remains unchanged.

This is a small tuning build intended specifically to get ducks closer to the visible pier edge.


## v0.20

This corrects the real limiter around the pier.

What was wrong in v0.18/v0.19:
- only the **resting buffer** was reduced;
- the tighter **travel obstacle** was still preventing duck centres from getting close enough to the front/near edge;
- so the visible result barely changed.

What changed in v0.20:
- reduced the **front / near-side travel obstacle** so ducks can move and rest closer to the visible front edge of the pier;
- changed the **resting buffer** to a **far-side-only** protection zone;
- kept the single-pier depth logic from v0.17.

Expected result:
- ducks should now be able to tuck much closer under the front edge of the pier;
- far-side stopped ducks should still avoid the awkward half-overlap positions.


## v0.21

Pier avoidance reset to match **v0.14 exactly**.

What changed:
- removed the later split between pier travel obstacle and resting buffer;
- restored the original v0.14 rectangular pier exclusion:
  - `minX: -3`
  - `maxX: 35.5`
  - `minY: 61`
  - `maxY: 84`
- kept the later improvements from newer builds:
  - responsive/mobile sizing
  - responsive duck scale
  - single depth-sorted pier rendering

This build should reproduce the original v0.14 pier spacing/behaviour while preserving the later non-pier improvements.


## v0.22

Pier exclusion logic now follows the user's marked keep-out areas rather than a single large pier rectangle.

Changed:
- removed the coarse v0.14 rectangular pier exclusion;
- added three explicit rectangular exclusion boxes:
  1. the long front deck/fascia strip
  2. the top-right corner cap
  3. the right-side end/front face

Kept:
- mobile/responsive sizing
- responsive duck size
- single depth-sorted pier rendering

Intent:
- far-side ducks can come much closer to the top edge of the pier;
- ducks should no longer sit unrealistically far above the pier;
- ducks should still be prevented from drifting under the timber.


## v0.23

Front-side pier depth correction.

Kept unchanged:
- the successful top/far-side pier behaviour from v0.22;
- the explicit pier keep-out boxes;
- mobile/responsive scaling;
- the single complete pier asset.

Changed:
- added an explicit near-side depth test;
- ducks below the pier's long front edge render in front of the whole pier;
- ducks below the sloping right-end edge also render in front;
- far-side/top ducks continue rendering behind the pier.

This is intended to stop near-side ducks being cut in half by the deck or front posts.


## v0.24

Targeted under-pier resting fix.

Kept unchanged:
- the successful top/far-side pier behaviour from v0.23;
- the explicit pier keep-out boxes;
- the near/front-side depth rule from v0.23;
- mobile/responsive sizing.

Changed:
- added a **destination-only diagonal under-pier exclusion**;
- ducks can still **swim behind the pier** because `inWater()` is unchanged;
- ducks can no longer **stop** in the low under-pier transition zone where:
  - feet peek out beneath the deck,
  - or a smaller duck can be promoted into the wrong front/behind relationship.

The diagonal runs roughly from the lower-left grass edge under the pier up toward the right post, matching the user's marked pink guide.


## v0.25

Sequential Add Duck distribution fix.

Cause:
- a newly added duck was inserted into the global duck map before its first destination was selected;
- after resurfacing at `(37, 73.6)`, `distributedPoint()` included that same duck in the distance calculation;
- the selected destination was therefore biased toward the point farthest from the entry location, repeatedly pushing ducks toward the far/right side.

Fix:
- `distributedPoint()` now accepts an optional duck to exclude;
- `animateEntry()` calls `distributedPoint(duck)` so the entering duck is not compared against itself;
- existing ducks still influence distribution normally;
- Load 10/25/50/60 behaviour is otherwise unchanged.


## v0.26

Directional pier-depth transition.

The previous depth switch used only the duck anchor point, so a large sprite
could remain fully in front of the pier after it had visually started crossing
behind it.

Changed:

- each swim now records whether its start and destination are in front of or
  behind the pier;
- front-to-behind movement uses a look-ahead offset, switching behind earlier;
- behind-to-front movement uses a look-behind offset, switching in front later;
- while crossing behind, the duck is explicitly kept below the pier layer;
- stationary depth and all pier exclusion zones remain unchanged.

This is a rendering transition change only. It does not alter destination
selection or pond distribution.


## v0.27 — Directed Add debug mode

Added a deterministic pier-testing workflow:

1. Turn **Directed Add** on.
2. Click an exact destination in the pond.
3. A crosshair marks the point.
4. Press **Add Duck**.
5. The duck performs the normal pier entry and then swims to that exact destination.

Validation:

- valid destinations use the normal yellow marker;
- excluded destinations show a red marker and are not accepted;
- automatic Add Duck distribution remains available when Directed Add is off;
- the same valid-resting-point check is used for directed destinations and normal initial distribution.

This build intentionally leaves the current pier-depth transition code in place so the crossing behaviour can be reproduced consistently.


## v0.28 — Latched pier-crossing depth

This version removes the frame-by-frame pier-depth oscillation that caused a
duck to flash in and out while crossing behind the pier.

Behaviour:

- front-to-behind:
  - starts in front;
  - switches behind at the early crossing threshold;
  - remains locked behind for the rest of that swim;
- behind-to-front:
  - starts behind;
  - switches in front only after the trailing clearance threshold;
  - remains locked in front for the rest of that swim;
- when the swim ends, the ordinary stationary depth rule is applied.

Unchanged:

- Directed Add debug mode;
- pier exclusion zones;
- under-pier destination exclusion;
- automatic distribution;
- mobile/responsive sizing.


## v0.29 — Authoritative destination validation

All duck stopping positions now pass through one canonical function:

- `canDuckStopAt(x, y)`

It is used by:

- Directed Add
- normal Add Duck initial distribution
- Load 10 / 25 / 50 / 60
- roaming destinations
- distributed destinations
- instant duck placement
- the `animateMove()` destination boundary

A new `nearestValidStoppingPoint()` safety function relocates any invalid
destination to the nearest valid point before placement or movement begins.

This means an automatic code path can no longer place a duck at a point that
Directed Add would reject.

Movement paths may still visually pass behind the pier, but completed/resting
positions must satisfy the same exclusion rules everywhere.


## v0.30 — Expanded under-pier exclusion and validated load buttons

Under-pier boundary:

- moved the left end from approximately `x=12, y=82.8` to
  approximately `x=7.5, y=76.8`;
- moved the right end to approximately `x=35.5, y=71.5`;
- added a small body-clearance margin because the duck artwork extends around
  its centre anchor.

Load 10 / 25 / 50 / 60:

- every generated candidate must pass `canDuckStopAt()`;
- each final point is checked again before the duck is created;
- the loader now samples more candidates so exclusion-aware distribution still
  spreads the population across the available pond;
- an invalid final point raises a visible coding error rather than silently
  placing a duck in an excluded zone.

Unchanged:

- Directed Add;
- latched pier-depth crossing;
- top/far-side pier behaviour;
- mobile/responsive sizing.


## v0.31 — Mobile/orientation and moving-depth correction

### Portrait sizing
- reduced the minimum duck size in portrait;
- uses a smaller portrait-specific scene-width factor.

### Entry alignment
- replaced pixel-based Web Animations entry coordinates with percentage-based
  requestAnimationFrame movement;
- walking, jumping, resurfacing and splash positions now remain tied to the
  16:9 scene during portrait/landscape changes;
- splash placement is percentage-based.

### Orientation changes
- resize and orientation events resynchronise duck size and depth;
- active percentage-based entry movement continues against the new scene size
  instead of using stale pixel coordinates.

### Moving duck layering
- ordinary swimming uses live Y-based depth sorting on every frame;
- the latched front/behind override is used only inside the pier crossing
  corridor;
- moving ducks should no longer sit artificially behind or in front of the
  entire flock until they stop.

### Mobile status
- portrait status messages are smaller;
- they fade automatically after approximately 2.8 seconds.


## v0.32 — Fixed world-coordinate refactor

The interactive scene now uses one immutable internal coordinate system:

- **World size:** `1672 × 941`
- the browser scales the complete world uniformly to fit the visible scene;
- device rotation changes only the outer world scale;
- duck positions, pier entry, splash position/size, exclusions and depth rules
  remain in the same internal coordinates.

### Mobile fixes

- fixed world-sized ducks instead of viewport-sized ducks;
- portrait ducks therefore shrink with the pond rather than maintaining a
  minimum CSS size;
- the walk animation uses a dedicated **feet anchor**;
- the feet path follows the pier surface in world coordinates;
- splash dimensions are world units and scale with the pond;
- active entry animations do not need their positions recalculated on rotation.

### Controls

Removed:

- Load 10
- Load 25
- Load 50

Retained:

- Directed Add
- Add Duck
- Load 60 Ducks
- Reset

### Carried forward

- v0.30 exclusion-aware population loading;
- Directed Add;
- inclusive pond-edge validation;
- live Y-based duck-to-duck depth sorting;
- pier crossing override only while inside the pier influence area.


## v0.33 — Zoomed portrait, exact frame and routed pier movement

### Portrait
- the world is zoomed to 1.45× relative to fit-to-width;
- the pond becomes horizontally pannable by touch;
- portrait initially opens at the left/pier side;
- landscape and desktop continue to show the complete pond.

### Frame
- the visual border is now a separate outer frame;
- an inner viewport and sized world stage remove the fractional blue gap;
- the world begins at the inner viewport's exact `0,0`.

### Status messages
- debug/status messages are no longer overlaid on the pond;
- they appear in a compact bar below the framed image.

### Entry walk
- walking uses a dedicated bottom-centre visual wrapper;
- the visible duck feet are anchored to the pier path instead of estimating
  the sprite centre;
- the path was lowered slightly to sit more naturally on the deck.

### Pier-safe movement
- destinations whose direct route intersects the pier use validated waypoints
  around the right end;
- the route planner tries rear-side and front-side waypoint combinations;
- initial distribution swims and roaming swims use the same route planner.

### Splash
- reduced from `86 × 30` to `64 × 22` world units;
- maximum expansion reduced from `1.8×` to `1.45×`.


## v0.34 — v0.33 runtime repair

- removed the orphaned `statusObserver.observe(...)` call left after moving status messages below the pond;
- this ReferenceError prevented `applyWorldScale()` from running and collapsed the viewport;
- added a one-time load reflow as a safety check;
- all v0.33 zoom, panning, frame, walking-anchor and route changes are otherwise unchanged.


## v0.39 — Permanent pier layer

This build branches directly from **v0.34**. The route experiments in
v0.35–v0.38 are not included.

Layer model:

1. background;
2. swimming ducks, Y-sorted against one another;
3. foreground bank and reeds;
4. the complete pier at `z-index: 2200`;
5. the temporary waddling/jumping entry duck at `z-index: 2600`;
6. splash effects at `z-index: 3000`.

Consequences:

- every swimming duck is permanently behind the entire pier;
- the waddling and jumping duck remains visibly on top of the pier;
- after resurfacing, that duck immediately returns below the pier;
- there is no front/behind pier classification or transition latch;
- there is no frame at which a swimming duck can pop above the pier corner.

The existing under-pier stopping exclusion remains in place. Route validation
now uses the same exclusion, so swimming ducks cannot travel through the area
below or directly in front of the pier. They must pass around the right-hand
end.

Normal live Y-based depth sorting between ducks remains active.
