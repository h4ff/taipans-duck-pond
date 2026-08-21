# Taipan Pond v0.59


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
