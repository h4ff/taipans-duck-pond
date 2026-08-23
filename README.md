# Taipan Pond v0.67

## v0.67 — Simulation Recovery / Mobile UX Rebase

v0.67 corrects the second v0.65/v0.66 regression by restoring the stable v0.64 pond simulation/depth helpers (`depthZForY`, `setDepth`, `setEffectDepth`, and `pointOnSegment`) while retaining the intended loading overlay, bounded preload, focal-point mobile pinch zoom, portrait view, and landscape mobile controls from v0.65/v0.66. The missing `setDepth()` caused ducks to complete the pier/jump sequence and then fail as they entered swimming state; the missing depth/effect helpers also endangered Y-sorted splash behaviour and exclusion geometry. No production artwork/assets changed.
