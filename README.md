# Duck Pond — v1.2.0

## v1.2.0 — Production release (26 Nov 2026)

Promoted directly from the user-tested v1.2-dev.38 release candidate. No gameplay, animation, styling, artwork, audio content or CSV changes were made during promotion. Production version and cache references are updated; historical development notes are retained below.

- Lincoln’s cricket challenge appears after the last duck enters the pond, with touch-friendly bowler selection and bowling controls.
- Sixes, wides with water splashes, and bowled dismissals; six legal deliveries per over, cumulative scoring and bowler changeover.
- Independent scoreboard encouragement, sandpaper hints and Lincoln’s sledges; new/scuffed ball artwork and cricket sound effects.
- Completed batting wing, wicket ball depth and pavilion walk-off animations; larger speech bubbles and corrected rear walking-leg pivot.
- Mobile portrait cricket launch offers a dismissible landscape suggestion without forcing rotation.

**Deployment:** merge the release code, assets and documentation into the production repository. Preserve the live `data/players.csv` and `data/ducks.csv` if they have been updated independently. Third-party audio reuse rights remain unverified and should be confirmed before public distribution.

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


## v1.2-dev.1 — Lincoln bowling game prototype

DEV ONLY. Adds the first playable Lincoln bowling Easter egg: “Bowler’s name?” trigger, in-pond bowler selection, field-setting choreography, flick-to-bowl ball control, Lincoln sixes/scoreboard taunts, scoreboard sandpaper rubbing mechanic, scuffed inswing dismissal, Lincoln walk-off and normal pier re-entry. Cricket graphics are intentionally temporary CSS artwork for gameplay testing. Production is unchanged.


## v1.2-dev.2

- Fixes the cricket trigger being nested inside a mobile-only toolbar and therefore hidden on desktop.
- Moves “Bowler’s name?” into the main production toolbar so it is visible on desktop and mobile, but remains hidden in TV display mode.
- Corrects CSS and JS cache-buster references to the current dev build.

## v1.2-dev.3

- Reoriented cricket pitch to run away from the viewer.
- Bowling is now an upward flick-to-release gesture; the delivery path runs automatically.
- Disabled normal click-scoot and collision reactions while cricket is active.
- Kept the cricket ball visible through delivery and six animations and hardened reset behaviour.
- Increased ball size.
- Added random six trajectories around the ground.
- Pushed fielders toward the pond edges and made them face Lincoln once set.
- Moved “Bowler’s name?” above the scoreboard and only reveals it after all weekly entrants have finished.
- Enlarged scoreboard taunts; only some taunts mention sandpaper.
- Improved temporary bat proportions for the prototype.

## v1.2-dev.4

- Corrected Lincoln's dismissal exit.
- Lincoln now swims toward the pavilion bank, gets visually smaller as he moves away,
  transitions to walking near the steps, walks up toward the pavilion door, and disappears through it.
- Removed the reverse-pier/moonwalk exit from the cricket game.

## v1.2-dev.5

- Fixed the cricket trigger disappearing after devices had previously opened `?tv=1`.
- Forced TV mode is now tied to the current URL/device only and is no longer persisted in localStorage.
- The normal dev URL therefore returns to normal interactive mode automatically.
- Added a defensive post-load reveal for the “Bowler’s name?” trigger after the pond entry sequence completes.

## v1.2-dev.6

- Corrects the live DEV mismatch where `index.html` and `app.js` were on dev.5 but `styles.css` was still the dev.2 cricket layout.
- Includes `src/styles.css` in the changed-files package.
- Removes runtime hidden/unhidden logic from “Bowler’s name?”.
- The trigger is visible in the pond by default, hidden only while cricket is running, and remains hidden in TV display mode.

## v1.2-dev.7

- Enlarges the cricket ball's invisible mobile touch target while keeping the visible ball close to its current size.
- Stops ball pointer gestures from bubbling into pond scrolling/selection.
- Slightly enlarges the cricket ball interaction target again in mobile landscape.
- Moves Lincoln forward of the stumps and forces Lincoln/bowler above pitch/stump layers.
- Smooths six trajectories with more path points and curved interpolation.
- Slows the post-hit flight slightly for a cleaner read.
- Removes Lincoln's water-to-land size jump by matching the first walk scale to the final swim scale.
- Changes Lincoln's exit path so he settles onto the stairs first, then walks upward toward the pavilion doors while getting smaller.

## v1.2-dev.8

- Replaces flick-to-bowl with pull-back-and-release.
- The ball now follows the pointer/finger whenever held, making the same drag interaction usable for the sandpaper clue.
- A pull toward the viewer of sufficient distance releases a fixed delivery; the pull distance does not yet change pace.
- Moves the ready ball farther up-pitch so it no longer sits underneath the bowler.
- Forces Lincoln into a consistent right-handed batting orientation rather than inheriting his previous pond-facing direction.
- Updates the scoreboard instruction to “PULL BACK & RELEASE”.

## v1.2-dev.9

- Moves the ready ball farther up-pitch so it sits clearly in front of the bowler.
- Makes the bowler's front wing track the dragged ball.
- Corrects Lincoln's exit target to the top waterline at the foot of the pavilion steps.
- Starts Lincoln's walking asset at ~0.45 scale to match the pond perspective at that waterline and remove the size jump.
- Keeps Lincoln on the lower steps first, then walks him upward while shrinking toward the pavilion.
- Uses the actual Gangnam stage/door cavity so the pavilion door visibly opens as Lincoln approaches.
- Fades the pitch once Lincoln is roughly halfway between the wicket and the water's edge.
- Rebuilds the temporary cricket bat as a separate visible handle and blade so the handle remains present while batting and walking.

## v1.2-dev.10

- Moves Lincoln's walk-off left onto the actual pavilion staircase line shown in the background art.
- Forces Lincoln above the stair foreground while walking to the door.
- Tucks the temporary bat under his arm for the walk-off.
- Hides ball, stumps and pitch as the walk-off begins.
- Resumes normal pond activity as soon as Lincoln disappears through the pavilion doors; his later pier re-entry no longer keeps the pond in cricket mode.
- Raises the cricket flight layer above the foreground bank so the ball cannot disappear behind it.
- Adds ball perspective scaling: smaller away from the viewer, larger toward the viewer.
- Extends six trajectories off-screen instead of leaving the ball apparently stuck in trees/buildings, including some shots in front of the wicket.
- Keeps the bowling wing anchored at the shoulder and limits tracking to rotation plus a small reach.


## v1.2-dev.11

- Splits the ball into its own top flight layer: pitch/stumps remain below the ducks while the ball stays above foreground banks.
- Uses a shorter one-piece bat and a smaller, more natural swing.
- Replaces spline sixes with monotonic segmented trajectories and guarantees every six leaves the world boundary.
- Keeps ball perspective scaling based on travel toward/away from camera.
- Moves Lincoln's water exit slightly farther away before the walk transition and keeps his stair walk above foreground at z-index 4000.
- Makes the post-dismissal redistribution a slower staggered drift rather than a violent simultaneous snap.
- Resumes normal pond activity as soon as Lincoln reaches the pavilion doors; his later pier re-entry remains independent.
- Adds a small cricket presentation prewarm and staggers first field-setting starts to reduce the first-play mobile hitch.

## v1.2-dev.12

- Fixes the dev.11 bowling regression where the ball's ready position was y=73.2 but the scripted delivery still began at y=75.8.
- Every delivery now starts from the exact visible ready position.
- Pull-back release is judged from the ball's world-space position rather than raw screen-pixel movement, making it reliable through mobile zoom/scroll.
- Adds pointercancel/lostpointercapture recovery so mobile browsers cannot leave the ball stuck in a drag state.

## v1.2-dev.13

- PC-only focused fix: replaces the post-contact multi-segment six trajectory with one simple mathematical arc to an off-screen endpoint.
- No wing, bat, Lincoln walk-off, layering, fielding or redistribution changes from v1.2-dev.12.

## v1.2-dev.14

- Scuffed-ball interaction fix only.
- As soon as the sandpaper rub completes, the current pointer drag is ended cleanly and the scuffed ball is returned to the ready position.
- The next grab therefore starts from a fresh pointer/capture state instead of reusing the scoreboard drag.


## v1.2-dev.16

- Rebuilt from v1.2-dev.14; v1.2-dev.15 is discarded.
- Wing tracking only: the front wing now pivots from the actual rounded shoulder of the supplied wing asset (38.5%, 64.5%), not the previous off-art pivot.
- Tracking is removed from the ball-position function entirely, so it cannot alter bowling/reset state.
- Tracking starts only once the ball has actually been pulled back, then rotates the wing tip toward the pointer with no translation/reach.

## v1.2-dev.17

- Corrects the wing-tip tracking for the mirrored right-facing swim stack: the rounded shoulder stays fixed and the pointed end now aims at the dragged ball.
- Adds timeout-backed completion to both delivery and hit-flight animations so a dropped/stalled animation frame cannot leave the ball permanently stranded mid-bowl.
- No bat, Lincoln walk-off, fielding, redistribution or scoreboard changes.

## v1.2-dev.18

- Wing release animation only.
- Pull-back tracking is unchanged: the pointed tip follows the ball around the fixed rounded shoulder pivot.
- On a valid release the wing holds its exact aim briefly, snaps a maximum of 28° toward the pitch, then settles to rest.
- Removes the old always-on cricket bowling-wing animation that caused the wing to rock independently.
- No ball, bat, walk-off, fielding, redistribution or scoreboard behaviour changes.


## v1.2-dev.19

- Rebuilds bowling as a true slingshot. The ball launches from the actual release point on the line formed by the pull-back angle.
- Normal deliveries travel in a straight line. A generous striker corridor decides whether Lincoln can hit it; misses are called WIDE and re-bowled.
- Wides add one run but do not consume a legal ball.
- Scoreboard now shows innings score and over progress: wickets/runs (for example 0/6) with legal-ball notation (for example 0.1).
- Sixes add six runs and one legal ball. Sandpaper becomes active after four legal deliveries.
- The bowler's front wing follows the ball through the delivery and returns to normal only when Lincoln hits it or a wide is called.
- Once scuffed, the ball still launches from the user's slingshot release but then wobbles aggressively and always bends back into Lincoln's stumps.

## v1.2-dev.21

- Shot-direction refinement only.
- Leg-side legal deliveries are now hit to the leg side 100% of the time.
- Off-side legal deliveries increasingly favour off-side shots as they get wider, from about 62% just outside the straight band to about 98% at the widest hittable line.
- Deliveries around middle can still be hit to either side.
- No slingshot, wide, scoring, scuffing, wing, bat, walk-off or fielding changes.


## v1.2-dev.21

- Replaces Lincoln's temporary CSS bat with the existing real `assets/events/fight/bat.png` artwork.
- Uses an inverted copy of Lincoln's real front wing as the batting arm, with the bat layered behind the wing at the grip.
- The batting pose is present immediately at the crease; there is no fight-style draw/reveal transition.
- Legal-ball swing timing is contact-driven: the swing starts before the ball arrives and reaches its contact frame when the straight delivery reaches its actual `strikeX`.
- Shoulder rotation varies with delivery line. Wider leg-side balls add extra bat rotation around the grip to simulate wrist roll without over-rotating the wing.
- Slingshot, wides, scoring, shot-direction selection, scuffing and bowler-wing mechanics are unchanged.

## v1.2-dev.23

- Repositions the cricket ducks around the unchanged pitch/ball line: Lincoln moves right to x=56.0 so his beak sits nearer leg stump; the bowler moves left to x=52.6 so his beak sits beneath the ready ball.
- Reverts the failed dev.22 screen-space geometry solver.
- Batting swing is now calibrated from three artwork poses: widest legal off-side, straight, and widest legal leg-side.
- Shoulder rotation is substantially larger than dev.21 and interpolates from the actual strikeX.
- Deep leg-side deliveries add a small extra bat rotation around the existing grip to simulate wrist roll.
- Slingshot, wides, scoring, scuffing, bowler-wing behaviour, shot-direction logic, walk-off and fielding are unchanged.


## v1.2-dev.25

- Reworked Lincoln’s rear batting wing to use a second shoulder-driven front-wing asset behind the body, keeping the wing tips together through the swing.
- Made the dismissal splash visible before the existing pavilion walk begins.
- Removed the bat completely once Lincoln leaves the water, including the return walk.
- Raised the duck layer above the pier foreground for Lincoln’s stair climb without changing the established path, door timing, or disappearance point.
- Made both Lincoln and the attached “Bowler’s name?” speech bubble clickable.
- Wide deliveries now show **WIDE** as the main cricket scoreboard message.
- Bowler names are displayed in capitals during field setup.

## v1.2-dev.24

- Adds Lincoln's rear batting wing behind the body and mirrors it so the rear-wing tip follows the same shoulder sweep as the gripping front arm.
- Keeps the accepted dev.23 front-wing/bat contact calibration unchanged.
- Adds the normal pond splash animation/sound as Lincoln leaves the water after being bowled.
- Replaces the walk-off CSS/phantom bat with the same real bat asset used at the crease, tucked behind the front walking wing.
- Keeps Lincoln above the stair/pier walking surface while preserving the existing pavilion walk path, door-open timing and disappearance point.
- Removes the fixed cricket button. After the final weekly entrant has landed, a speech bubble appears from the Lincoln already swimming in the pond; clicking him starts the existing bowler-selection flow.
- No pitch, bowling, scoring, wide, scuffed-ball, shot-direction, fielding, door-path or disappearance behaviour changed.


## v1.2-dev.26
- Batting rear wing now uses the supplied rear-wing swim asset rather than a flipped front-wing clone.
- Pavilion walk-off layering now keeps Lincoln above the Verandah through the stair climb, then switches him behind the Verandah at the existing top-of-stairs waypoint.
- Removed the dev.25 whole-duck-layer z-index workaround; route, door timing, disappearance and other cricket behaviour are unchanged.



## v1.2-dev.31

- Vertically inverts the real rear batting wing around its existing grip origin, retaining the horizontal flip, translation, rotation and shoulder animation. Front wing, bat swing and pavilion exit are unchanged.
- Updates the stylesheet cache reference to dev.31.
- Ball/stump impact layering remains in the backlog.

## v1.2-dev.30

- Rear batting wing only: preserved the dev.29 tip/grip alignment and rotated the rear-wing artwork around that fixed grip point so the shoulder/root tucks farther behind Lincoln's body.
- Pavilion exit/layering deliberately unchanged.
- Ball/stump impact layering remains backlog.

## v1.2-dev.29
- Rear batting wing now uses the real rear-wing asset anchored by its actual pointed tip to the shared bat/front-wing grip point, and follows the exact front shoulder sweep.
- Lincoln remains above the Verandah for the entire pavilion exit sequence; the stair-top depth switch has been removed.
- Ball/stump impact layering remains in the backlog.

## v1.2-dev.28
- Lowered and re-anchored Lincoln’s real rear batting wing so it tracks the front-wing tip instead of protruding above his head.
- Delayed the pavilion Verandah depth switch by moving it slightly farther along the existing stair/landing route; path and door behaviour are unchanged.
- Ball/stump impact layering remains on the backlog.

## v1.2-dev.27
- Fixed Lincoln pavilion stair layering by overriding the existing `cricket-batter` `z-index: 2250 !important` rule during walk-off.
- Lincoln is now explicitly above `Verandah.png` while climbing the stairs, then switches behind it at the existing top-of-stairs waypoint.
- No rear-wing changes in this build.

## v1.2-dev.32
- Wides travel past the batting line and land roughly one-quarter of the way toward the water boundary with a small splash before the ball resets. Extreme aim is bounded to water on the chosen side.
- Six legal balls complete an over; Lincoln prompts “All too easy. NEXT?” and the selected fielder swaps places with the previous bowler. Running score and sandpaper clue progress are retained; wides do not count toward the six balls. A one-bowler test pond can reuse its bowler.
- Ten shuffled random sledges for balls 1/3/5; fixed help/sandpaper prompts for 2/4/6; Lincoln speaks after shots. Cricket scoreboard lettering enlarged.
- Batting artwork, pavilion exit and ball/stump impact layering unchanged.
- Both JS and CSS cache references updated.

## v1.2-dev.33
- Separate scoreboard encouragement and Lincoln's mocking reactions. Scoreboard legal balls 1/4/6 use random encouragement; ball 2 asks if the bowler needs help; balls 3/5 give escalating sandpaper hints. Wides display WIDE without advancing the legal-ball sequence.
- Lincoln has independent shuffled six, wide and bowled speech pools; no immediate repeats. Wicket shows GOT HIM! on the scoreboard and Lincoln reacts before the existing pavilion exit.
- The sixth-ball sledge is shown before the persistent “All too easy. NEXT?” prompt; existing fielder/bowler swap, running score and sandpaper unlock after four legal balls remain unchanged.
- No changes to delivery trajectories, bat/wing artwork, pavilion exit, stylesheet or assets. Ball/stump impact layering remains in the backlog.

## v1.2-dev.34
- Doubles Lincoln challenge and gameplay speech text (24px/26px), bubble padding, width limits and tail size; centres both bubble types over their existing speaker anchor, retaining the clickable challenge and speech behaviour.
- Corrects the shared rear walking leg pivot to the actual upper attachment on the 512px source canvas and removes the rear-leg per-step translations, retaining the existing male/female stride rotations and rear-body layering. This applies wherever the shared entry walk is used.
- No changes to game logic, scoreboard, ball flight, batting wing, pavilion path/depth or assets. Ball/stump impact layering remains in the backlog.

## v1.2-dev.35
- Uses the supplied transparent 100×100 new and scuffed cricket ball PNGs. The visible artwork is scaled to match the existing 24px/28px ball, retaining perspective scaling and the enlarged invisible touch target. Both images are preloaded.
- On a scuffed wicket delivery, the ball layer drops below Lincoln on its final approach while staying above the pitch and stumps. Restores normal depth on reset and dismissal cleanup. Existing ball paths, wicket timing, splash, score, batting wings and pavilion exit remain unchanged.
- Addresses the wicket ball layering backlog; requires visual confirmation on the pond.

## v1.2-dev.36 — Cricket audio integration (temporary samples)
- Bat impact at contact, crowd applause/cheer after sixes, 30% chance of a presentation-matched bowling grunt, stump impact and staggered appeal/cheer on dismissal. Uses existing pond sound mixer; wide splash unchanged.
- Scoreboard displays PICK NEXT BOWLER and preserves cumulative score/overs after six legal balls. Existing bowler swap is unchanged.
- Six original synthesized placeholder WAVs are included under assets/sounds/cricket/. The selected Myinstants downloads were unavailable and the user's recorded appeal was not accessible. Replace these WAVs with properly licensed/approved recordings before the final audio release; do not mistake them for the selected clips.
- No changes to ball trajectories, outcomes, artwork, CSS or pavilion/wing animations.

## v1.2-dev.37 — Supplied cricket audio
- Replaces all six temporary cricket WAVs with the supplied recordings: cricket-bat-hitting-sound.mp3, wood-pipe-falling.mp3 (bails), mario-ugh.mp3, ff-female-ahh.mp3, cheering.mp3 and the user-recorded howzat.mp3.
- Trims leading silence on the impact and female grunt, shortens/fades the cheer, and peak-level balances the clips. The complete appeal is retained. Uses local PCM WAVs and versioned audio URLs to bypass cached placeholder samples.
- All dev.36 sound triggers and end-of-over PICK NEXT BOWLER prompt retained. No gameplay, CSS or artwork changes.
- Third-party sound reuse rights have not been verified; confirm licensing before public deployment.


## v1.2-dev.38 — Mobile cricket landscape suggestion
- Shows a readable, dismissible landscape suggestion when Lincoln launches cricket in mobile portrait mode. It is outside the scaled world, disappears after rotation or dismissal, and never locks orientation or blocks portrait gameplay.
- Desktop and existing landscape play remain unchanged. No gameplay, sound, animation, data or asset changes.
- Final development candidate before production promotion, pending mobile confirmation and third-party audio licence verification.
