# Taipan Pond v0.61

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
