# Taipan Pond v0.57

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
