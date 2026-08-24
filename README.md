# Duck Pond – v0.87

## v0.87 – Weekly Playback + Live Scoreboard Test

- Replaced the temporary From/To date controls with a single **Week** dropdown.
- The dropdown selects an "as at Monday" marker; that option plays the completed club week immediately before it (previous Monday through Sunday inclusive).
- The most recent Monday is selected automatically on startup and its completed prior week auto-loads after assets are ready.
- Earlier duck events are already swimming, selected-week events enter via the pier, and future events remain absent.
- Expanded the fake season dataset to 24 events and deliberately created a clear cumulative leader/top three for testing.
- Added cumulative leaderboard logic based on all duck events in the pond through the selected week's Sunday. Ties are supported.
- Current leader player duck(s) receive the yellow leader headwear; President crown still overrides leader headwear.
- Reworked the in-scene scoreboard so it shows the **player currently entering** while they walk/jump, then advances to the next entrant or returns to the cumulative top-three leaderboard after the splash.
- Reworked the scoreboard popup to use the same live cumulative leaderboard data.
- Added a development-only data view below the pond showing the selected playback window, cumulative leaderboard, selected-week entrants and every event represented in the pond for easy comparison.
- The data/debug view remains hidden in mobile landscape so the v0.81 production-style no-page-scroll landscape behaviour is preserved.
- No production artwork changed.

## v0.86 – Player Identity + Date Range Foundation

- Added a fake player roster in `src/players.js` with persistent presentation, feather tone, build and permanent club roles.
- Added fake duck-event rows in `src/events.js`; event date and standard/golden/diamond type are separate from player identity.
- Added a clearly separated **Player / Date Test** rig while retaining the older manual/asset controls.
- **Add Selected Player** proves the same player keeps the same appearance while the event duck type can change.
- **Load Date Range** rebuilds the pond cumulatively: events before the range are already swimming, events inside the range enter one-by-one via the pier, and future events are absent.
- Multiple events for the same player create multiple permanent ducks while keeping that player's visual identity.
- Mobile landscape still hides the full test rig and remains the production-style pond view.
- No production artwork changed.

## v0.85 – Resurface Ring Depth Fix

- Raised the resurfacing splash/ring above the resurfacing duck so it renders in front during the fade-up from the water.
- Left the v0.84 entry path, splash size and resurfacing motion unchanged.

## v0.84 – Swim Resurface Direction Fix

- Fixed the post-splash swimming sprite so it rises upward from beneath the water into its final pond position instead of appearing above the landing point and moving downward.
- Pier walk, jump, splash position, splash scale and final swim position remain unchanged from v0.83.


## v0.83 – Pier Entry Position + Splash Scale

- Lowered the larger hero-entry duck path on the pier so the walk sits noticeably further down the Y-axis.
- Kept the same overall hero-entry concept but moved the jump/splash/entry location down to match.
- Increased splash/resurface effect size by 25% so the pond entry reads more clearly.

- Pier-walking ducks render at approximately 1.6× the previous entry scale.
- Duck size now transitions down smoothly during the jump, reaching the existing splash/pond scale before entering the water.
- Walk path, timing, splash location, swimming size and pond behaviour are unchanged.
- No artwork/assets changed.

- Mobile landscape now hides the full developer/test rig and behaves as a production-style pond view.
- Landscape base view fits both available width and height so the outer document does not need vertical scrolling; pinch/pan remains internal to the pond viewport.
- Visible version labels updated from v0.71 to v0.81.
- President remains a white-feather duck but is no longer forced to Standard: Test President and Load 60 can use the selected Standard/Golden/Diamond duck type.
- Female v0.80 assets and all existing simulation behaviour are preserved.

# Duck Pond – v0.80

- Normalised all 12 user-supplied female swim body variants back to the standard 512×512 production canvas.
- Preserved the corrected female artwork pixel-for-pixel and placed it at the original swim-body offset (41,94) so face, hat, wing and wake alignment stay correct.
- Female swim ducks continue to use the standard wake selection logic; no separate female wake is used.

# Duck Pond – v0.79

- Fixed female swim alignment: the 12 corrected user-supplied body PNGs were cropped to 430x327, while the swim renderer expects 512x512 layers. Each has been placed unchanged back onto a 512x512 transparent canvas at the canonical swim-body offset (41,94).
- This restores alignment with face, hat, wing and standard/golden/diamond wake layers.
- No code, walking female assets, or wake artwork changed.

# Duck Pond – v0.78

- Replaced all 12 generated female swim body variants with the user-supplied corrected PNGs.
- Female swim ducks continue to use the standard wake selection logic; the separate female wake is not used.
- No code changes and no walking female asset changes.

# Duck Pond – v0.77

- Rebuilt female swim variants again using the coloured male swim bodies only as the base colour fields, then adding only the extra female shirt area and female contour lines from the female swim source.
- This avoids the prior shirt-colour bleed past the female outline while keeping the walking female assets unchanged.

# Duck Pond – v0.76

- Rebuilt only the female swimming asset matrix from the supplied female swim source.
- Female swim geometry now comes exclusively from the female source; male swim assets are used only to sample palette colours.
- Female walking assets are unchanged.
- Retains the ~30% female Load 60 distribution from v0.74/v0.75.

# Duck Pond – v0.75

- Rebuilt female swim variants using the raw female swim source only as a contour/shape overlay on the correctly coloured swim bases, to avoid the mixed male/female artefacts from prior attempts.
- Left female walking assets unchanged.

# Duck Pond – v0.74

- Regenerated female swim assets so feather/shirt colours render correctly for all shirt types and feather tones.
- Patched female walking eyes/eyelids from the matching male face region so they colourise correctly.
- Load 60 now generates approximately 30% female ducks, evenly spread through the stress population.

# Duck Pond – v0.73

## v0.73 – Preload manifest hotfix
- Removed the obsolete female-wake entry from the preload manifest after female ducks returned to the shared wake system.
- Added a defensive filter so null/empty asset paths cannot block pond startup in future.
- No artwork or simulation behaviour changed.


- Replaced the female swimming body with the new base artwork and regenerated all female swim colour/shirt variants.
- Female ducks now use the same wake asset logic as male ducks.
- Fixed female walking eye whites so they no longer inherit feather colour.

# Taipan Pond v0.71

## v0.71 — Female Sprite Shadow Correction

- Corrects the female walk/swim "shadow duck" defect introduced by the v0.69 variant-generation method.
- Root cause: the generated female matrix had been baked by alpha-compositing the female artwork over complete male sprites, so the male silhouette was permanently embedded inside the female PNG files. This was an asset-generation bug, not a remaining male DOM/render layer.
- Rebuilt all 36 female walking variants directly from the supplied female walking frames, with feather and shirt colours applied programmatically and no male walking sprite underneath.
- Rebuilt all 12 female swimming bodies directly from the supplied female swimming body. The female shirt/bust area is filled to the established standard/golden/diamond colours and the existing navy collar colour is reused without compositing the male swim body.
- The supplied female-specific ripple remains unchanged.
- `+ Add Male` / `+ Add Female`, role/accessory logic, mobile zoom/pan, preload behaviour, movement, collision, Y-depth and exclusions are unchanged from v0.70.
- No male asset folders were reorganised. The existing dedicated `assets/duck/female/` tree already provides a clean presentation boundary, so moving the mature male tree would add risk without simplifying runtime selection.

### GitHub update
Because the fix is in the generated female PNGs, replace:
- `index.html`
- complete `src/` folder (safe normal workflow; runtime code is unchanged)
- `README.md`
- complete `assets/duck/female/` folder

No other asset folders changed.

---

## v0.70 — Female Base-Presentation Correction

- Female is now a first-class base presentation, not a test-role/accessory concept.
- Walking uses exactly one complete base frame: male OR female.
- Swimming creates exactly one base body element: male OR female.
- Female ducks continue to support the full shirt-type × feather-colour matrix from v0.69.
- Female ducks retain the female-specific swimming ripple; male ducks retain the existing type-specific wakes.
- `+ Add Duck` has been replaced by independent `+ Add Male` and `+ Add Female` controls.
- Both add controls use the currently selected Duck Type, Feather and Build and may be used repeatedly with no presentation-specific limit.
- Removed the single-instance `Test Female` control.
- `Load 60` continues to mix male/female presentation while preserving the maximum-three-yellow-feather stress-test rule.
- Shared faces, blinks, wings, headwear, crown, whistle, captain C, movement, collisions, Y-depth and exclusions remain unchanged.
- Existing male swimming artwork was intentionally not altered in this build.


## v0.69 — Full Female Variant Matrix

Built directly on the stable v0.68 simulation/mobile foundation.

### Changes
- Female presentation is now a full duck presentation variant rather than a fixed standard-white test case.
- Added generated female walking and swimming assets for every current combination of shirt type and feather tone: **standard / golden / diamond × white / yellow / light brown / dark brown**.
- Female variant artwork is derived with code from the supplied female base overlays and the existing production male variant assets, preserving the female bust/body contours while reusing the established shirt colours, feather palette and sprite alignment.
- Added 36 female walking sprites (3 frames × 12 type/tone combinations) and 12 female swimming body sprites.
- `Test Female` now follows the currently selected duck type, feather tone and build variant instead of forcing standard/white/standard.
- `Load 60` no longer forces female ducks back to standard white. Female ducks participate in the same feather, shirt-type and build distribution as the rest of the test population.
- The Load 60 female sample includes golden and diamond examples so the full presentation matrix is exercised in a normal stress test.
- The female-specific ripple/waterline remains in use for all female ducks.
- Existing hats, crown, captain C, coach whistle, faces, blinks, wings, collision logic, Y-depth sorting, mobile zoom/pan and bounded preload architecture are preserved.

### Asset generation note
The supplied female source artwork was not redrawn. Variant PNGs were generated programmatically by compositing/recolouring against the existing production variant sprites so alignment remains consistent with the current animation system.

### GitHub update
For the normal deployment workflow, replace:
- `index.html`
- the complete `src/` folder
- `README.md`
- the complete `assets/duck/female/` folder

No other asset folders changed in v0.69.

---

# Historical changelog

## v0.68 — Female Presentation + Housekeeping Pass

Built directly on the stable v0.67 simulation/mobile foundation.

### Changes
- Added the first female presentation architecture as a drop-in duck variant.
- Added the supplied three female walking frames, female swimming body and female-specific swimming ripple/wake unchanged.
- Female test ducks currently use the supplied **standard white** presentation; all existing face, blink, wing, hat, crown, whistle, movement, collision and depth systems are reused.
- Added **Test Female** for a full pier-entry → jump → swim check.
- Load 60 now includes six female-presentation test ducks spread through the population.
- Removed **Expand Pond** from mobile landscape only; stable landscape pinch/pan remains available. Portrait Expand Pond remains unchanged.
- Restored normal versioned project-folder packaging.
- Restored the cumulative README/changelog history after v0.67 accidentally replaced it with only the latest entry.
- No supplied production artwork was edited; the five new PNGs are copied as provided.


---

## Archived v0.67 notes

## v0.67 — Simulation Recovery / Mobile UX Rebase

v0.67 corrects the second v0.65/v0.66 regression by restoring the stable v0.64 pond simulation/depth helpers (`depthZForY`, `setDepth`, `setEffectDepth`, and `pointOnSegment`) while retaining the intended loading overlay, bounded preload, focal-point mobile pinch zoom, portrait view, and landscape mobile controls from v0.65/v0.66. The missing `setDepth()` caused ducks to complete the pier/jump sequence and then fail as they entered swimming state; the missing depth/effect helpers also endangered Y-sorted splash behaviour and exclusion geometry. No production artwork/assets changed.


## Archived v0.66 notes

## v0.66 — Startup Fix

Corrective release for v0.65. Restores five helper functions accidentally dropped during the v0.65 mobile-view refactor (`setWorldPosition`, `updateCounts`, `maxActiveSwimmers`, `scaleForY`, and `applyDuckSize`). The missing `updateCounts()` caused startup to stop at `0 / 99`; the other missing helpers would have broken duck creation and movement after loading. v0.66 also adds a visible startup-failure state instead of allowing the loading spinner to run forever if an early JavaScript error occurs. All v0.65 mobile zoom/pan, landscape behaviour, loading UI and bounded preload logic are otherwise preserved.

Built directly on v0.64.

### Changes
- Added a visible pond loading overlay while the existing bounded production sprite preload runs.
- Loading overlay includes a spinner, `Loading pond…` message and live asset progress count.
- Interaction remains blocked until the preload completes; the overlay fades away when all assets are ready and remains visible with an error state if any production asset cannot be loaded.
- Preserved the v0.64 six-image bounded preload queue, retries, decode timeouts and resident image cache.
- Corrected app-controlled pinch anchoring. Zoom now preserves a logical world coordinate beneath the pinch and tracks the current midpoint between the user's fingers rather than scaling toward a fixed corner.
- Coalesced pinch scroll-position updates to one animation frame so rapid pinch events cannot build up a queue of pending scroll work.
- Extended app-controlled pinch zoom/pan to mobile landscape as well as portrait.
- Extended the compact mobile toolbar/hidden developer-controls treatment to landscape-width iPhones up to 900 CSS px with a coarse pointer.
- Landscape now removes the large title block and nonessential status/footer chrome so the pond receives substantially more vertical space. `Expand Pond`/focus mode remains available, but landscape does not force an extra base crop; users can pinch in when they want a close-up.
- Portrait retains the larger v0.64 base/expanded pond view and 1×–2.5× app-controlled user zoom.

### Preserved
- Desktop layout and behaviour.
- Existing landscape pond geometry and simulation behaviour.
- 60-duck stress test support.
- All duck geometry, movement, collisions, Y-ordering and pier exclusions.
- Y-sorted splash/resurface effects.
- Captain C swimming placement fix.
- Production artwork/assets unchanged.

### GitHub update
For the normal deployment workflow, replace:
- `index.html`
- the complete `src/` folder
- `README.md`

No files under `assets/` changed in v0.66.


## Archived v0.65 notes

## v0.65 — Mobile UX & Loading Pass

Built directly on v0.64.

### Changes
- Added a visible pond loading overlay while the existing bounded production sprite preload runs.
- Loading overlay includes a spinner, `Loading pond…` message and live asset progress count.
- Interaction remains blocked until the preload completes; the overlay fades away when all assets are ready and remains visible with an error state if any production asset cannot be loaded.
- Preserved the v0.64 six-image bounded preload queue, retries, decode timeouts and resident image cache.
- Corrected app-controlled pinch anchoring. Zoom now preserves a logical world coordinate beneath the pinch and tracks the current midpoint between the user's fingers rather than scaling toward a fixed corner.
- Coalesced pinch scroll-position updates to one animation frame so rapid pinch events cannot build up a queue of pending scroll work.
- Extended app-controlled pinch zoom/pan to mobile landscape as well as portrait.
- Extended the compact mobile toolbar/hidden developer-controls treatment to landscape-width iPhones up to 900 CSS px with a coarse pointer.
- Landscape now removes the large title block and nonessential status/footer chrome so the pond receives substantially more vertical space. `Expand Pond`/focus mode remains available, but landscape does not force an extra base crop; users can pinch in when they want a close-up.
- Portrait retains the larger v0.64 base/expanded pond view and 1×–2.5× app-controlled user zoom.

### Preserved
- Desktop layout and behaviour.
- Existing landscape pond geometry and simulation behaviour.
- 60-duck stress test support.
- All duck geometry, movement, collisions, Y-ordering and pier exclusions.
- Y-sorted splash/resurface effects.
- Captain C swimming placement fix.
- Production artwork/assets unchanged.

### GitHub update
For the normal deployment workflow, replace:
- `index.html`
- the complete `src/` folder
- `README.md`

No files under `assets/` changed in v0.65.


## Archived v0.64 notes

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


## Archived v0.63 notes

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


## Archived v0.62 notes

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


## Archived v0.61 notes

## v0.61 — Role Accessories Pass

Built directly on the stable v0.60 baseline.

### Changes
- Added repeatable `captain` and `coach` player roles; any number of ducks can hold either role and roles can stack.
- Added a code-rendered captain **C** marker on the shirt for walking and swimming ducks.
- Added the supplied coach whistle/lanyard assets unchanged for the pier walk and both swimming directions.
- Coach whistle remains correctly oriented as a duck turns; captain C remains readable rather than mirroring.
- Added **Test Captain** and **Test Coach** controls for replaying those roles through the full pier-entry sequence.
- `Load 60 Ducks` now includes six captain examples and two coach examples for role testing. The leader is also a captain, and one captain is also a coach, to verify stacked roles.
- Existing headwear priority remains **President crown > leader cap > normal TCC cap**. Captain/coach markers coexist with whichever headwear wins.

### Preserved from v0.60
- President is a white duck.
- Maximum of three yellow-feather ducks in the `Load 60` test population.
- Scene geometry and pier behaviour.
- Mobile portrait/landscape behaviour.
- Swimming, turning, wakes and collision interactions.
- Feather colours and body-build variants.
- Idle blinks, double blinks, wing flicks and varied bob timing.
- Mobile click-reaction fix.

### Known visual note
The surprised-face eyebrows may still tuck beneath headwear. This remains intentionally unchanged.


## Archived v0.60 notes

## v0.60 — Headwear & Role Foundation

Built directly on the stable v0.59 baseline.

### Changes
- Added generic headwear states with priority: **President crown > leader cap > normal TCC cap**.
- Added supplied President crown assets for the pier walk and both swimming directions.
- President is fixed as a **white duck** in the current test population and President replay control.
- Added code-derived yellow leader-cap assets from the existing normal TCC cap artwork. The red TCC logo and linework are preserved.
- Added **Test President** and **Test Leader** controls. If that role already exists, the existing role duck is removed and immediately re-enters from the pier rather than creating duplicates.
- `Load 60 Ducks` now includes one President and one leader for role-overlay testing.
- `Load 60 Ducks` now limits yellow-feather ducks to a maximum of three (three in the normal 60-duck population).

### Preserved from v0.59
- Scene geometry and pier behaviour.
- Mobile portrait/landscape behaviour.
- Swimming, turning, wakes and collision interactions.
- Feather colours and body-build variants.
- Idle blinks, double blinks, wing flicks and varied bob timing.
- Mobile click-reaction fix.

### Known visual note
The surprised-face eyebrows may still tuck beneath headwear. This is intentionally unchanged for this build.


## Archived v0.59 notes

## v0.59 — Club Hats Pass

- TCC hat shown by default on every duck.
- Walking hat overlays all walk frames and all duck type/feather/build variants.
- Dedicated left/right swim hats keep the TCC logo correctly oriented when ducks turn.
- Hats stay in place through blinking, idle wing flicks, click reactions and collisions.
- v0.58 pond geometry, mobile behaviour, movement, collisions and idle-life timing are unchanged.

## v0.58 — Idle Life Pass

- Independent neutral/sad blinking using `NeutralBlink.png` and `SadBlink.png`
- Natural random blink spacing with occasional double blinks
- Blinks suppressed/cancelled during angry, surprised, collision and click reactions
- Infrequent subtle idle front/back wing flicks using the existing wing layers
- Existing bob variation, movement, geometry, collision behaviour, variants and mobile behaviour preserved

v0.57 was the asset-cleanup build based on v0.55. Its production asset structure remains unchanged apart from the two added blink overlays.

## What changed

Older versioned asset folders and superseded sprite copies were removed. The live build now uses a single organised asset tree:

- `assets/scene/` — background and foreground scene layers
- `assets/duck/walk/` — current walking sprites for duck type + feather tone
- `assets/duck/swim/body/` — current swimming body variants
- `assets/duck/swim/wing/` — current swimming wing variants
- `assets/duck/swim/face/` — current face overlays, including feather-aware sad eyelids
- `assets/effects/splash/` — standard/golden/diamond splash frames
- `assets/effects/wake/` — standard/golden/diamond wakes

No v40/v41/v43/v44/v51/v52/v53 folders remain in the production asset tree.

## Preserved from v0.55

- Feather colours: white, yellow, light brown, dark brown
- Build variants: standard, short, tall & skinny, stocky, big
- Load 60 mix: 55 standard shirts, 4 golden, 1 diamond
- Swimming behaviour and collision interactions
- Pier layering/exclusions
- Walking/jump/splash sequence
- Mobile behaviour and scene scaling


## Archived v0.58 notes

## v0.58 — Idle Life Pass

- Independent neutral/sad blinking using `NeutralBlink.png` and `SadBlink.png`
- Natural random blink spacing with occasional double blinks
- Blinks suppressed/cancelled during angry, surprised, collision and click reactions
- Infrequent subtle idle front/back wing flicks using the existing wing layers
- Existing bob variation, movement, geometry, collision behaviour, variants and mobile behaviour preserved

v0.57 was the asset-cleanup build based on v0.55. Its production asset structure remains unchanged apart from the two added blink overlays.

## What changed

Older versioned asset folders and superseded sprite copies were removed. The live build now uses a single organised asset tree:

- `assets/scene/` — background and foreground scene layers
- `assets/duck/walk/` — current walking sprites for duck type + feather tone
- `assets/duck/swim/body/` — current swimming body variants
- `assets/duck/swim/wing/` — current swimming wing variants
- `assets/duck/swim/face/` — current face overlays, including feather-aware sad eyelids
- `assets/effects/splash/` — standard/golden/diamond splash frames
- `assets/effects/wake/` — standard/golden/diamond wakes

No v40/v41/v43/v44/v51/v52/v53 folders remain in the production asset tree.

## Preserved from v0.55

- Feather colours: white, yellow, light brown, dark brown
- Build variants: standard, short, tall & skinny, stocky, big
- Load 60 mix: 55 standard shirts, 4 golden, 1 diamond
- Swimming behaviour and collision interactions
- Pier layering/exclusions
- Walking/jump/splash sequence
- Mobile behaviour and scene scaling


## Archived v0.57 notes

Asset-cleanup build based on v0.55. Behaviour and visuals are intentionally unchanged.

## What changed

Older versioned asset folders and superseded sprite copies were removed. The live build now uses a single organised asset tree:

- `assets/scene/` — background and foreground scene layers
- `assets/duck/walk/` — current walking sprites for duck type + feather tone
- `assets/duck/swim/body/` — current swimming body variants
- `assets/duck/swim/wing/` — current swimming wing variants
- `assets/duck/swim/face/` — current face overlays, including feather-aware sad eyelids
- `assets/effects/splash/` — standard/golden/diamond splash frames
- `assets/effects/wake/` — standard/golden/diamond wakes

No v40/v41/v43/v44/v51/v52/v53 folders remain in the production asset tree.

## Preserved from v0.55

- Feather colours: white, yellow, light brown, dark brown
- Build variants: standard, short, tall & skinny, stocky, big
- Load 60 mix: 55 standard shirts, 4 golden, 1 diamond
- Swimming behaviour and collision interactions
- Pier layering/exclusions
- Walking/jump/splash sequence
- Mobile behaviour and scene scaling
