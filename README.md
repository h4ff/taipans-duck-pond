# Taipan Pond v0.63

## v0.63 — Mobile & Layering Reliability Pass

Built directly on v0.62.

### Changes
- Fixed the swimming captain **C** so it sits on the exposed shirt area beneath the front wing instead of appearing printed on top of the wing.
- Splash and resurfacing effects now participate in the same Y-axis depth ordering as swimming ducks. Ducks lower on screen render in front of the effect; ducks higher on screen render behind it.
- Reworked production sprite preload into a bounded six-image queue with finite load/decode timeouts and retries, targeting the iPhone/Safari case that could stall at `92/99`.
- Mobile developer controls are collapsed behind **Test Controls** instead of permanently taking up portrait screen space.
- Added **Expand Pond** on mobile: hides non-essential header/status/footer UI and increases portrait pond zoom for easier viewing.
- Normal portrait pond zoom is also modestly increased from the v0.62 level.
- Pinch zoom is explicitly allowed on the pond, while world rescaling now ignores pinch/browser-chrome resize noise so the scene should no longer reset or snap during a pinch gesture.

### Preserved from v0.62
- President crown and white President duck.
- Leader cap and headwear priority: **President crown > leader cap > normal TCC cap**.
- Multiple captains/coaches and stacked roles.
- Maximum of three yellow-feather ducks in the `Load 60` test population.
- Scene geometry and pier behaviour.
- Swimming movement, turning, wakes and collision interactions.
- Feather colours and body-build variants.
- Idle blinks, double blinks, wing flicks and varied bob timing.
- Mobile click-reaction fix.

### Hosted testing note
For the cold-load test, use a private/incognito window or clear site data. The preload counter must either reach the full manifest count or report a finite failed-image message; it should never remain indefinitely at an intermediate count.
