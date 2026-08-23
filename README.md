# Taipan Pond v0.65

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
