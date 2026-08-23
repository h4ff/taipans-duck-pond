# Taipan Pond v0.64

## v0.64 — Portrait Pinch-Zoom Stability Pass

Built directly on v0.63.

### Likely cause identified
The v0.63 resize guards already prevented the production preload, duck creation, timers and listeners from being duplicated during normal visualViewport pinch events. The repeatable iPhone white-screen/reload is therefore most consistent with iOS WebKit compositor/memory pressure: native browser pinch magnifies the entire page/visual viewport while the pond is already a large transformed layer containing 60 independently animated, multi-layer ducks plus decoded sprite resources. At roughly 2–3× Safari can allocate enough additional backing/tile memory for WebKit to terminate and reload the page.

### Changes
- Replaced native pinch *over the portrait pond* with app-controlled two-finger pond zoom. The actual Safari page viewport stays stable.
- App zoom ranges from 1× to 2.5× on top of the existing portrait pond view and preserves the pinch focal point while zooming.
- The zoomed pond can be panned horizontally and vertically inside its clipped viewport.
- Added **Reset Zoom** when an app zoom is active.
- Removed the visualViewport resize listener entirely. Layout rescaling now responds only to meaningful page-layout width changes or a debounced orientation change.
- Pinch updates only change world transform/stage dimensions and scroll position; they do **not** rebuild duck DOM, recreate splash/wake layers, restart timers/listeners or rerun sprite preloading.
- Preserved the v0.63 six-image bounded preload queue, retries and timeouts unchanged.

### Preserved from v0.63
- Desktop behaviour and landscape mobile behaviour.
- Larger portrait real estate and Expand Pond mode.
- 60-duck stress test support.
- All duck geometry, movement, collisions, Y-ordering and pier exclusions.
- Y-sorted splash/resurface effects.
- Swimming captain C placement fix.
- Production artwork/assets unchanged.

### iPhone test
Load 60 ducks, enter Expand Pond, then two-finger pinch directly on the pond. The pond should zoom to a close-up without Safari itself magnifying the page, and one-finger swipes should pan around the enlarged pond. Use **Reset Zoom** to return to the base expanded view.
