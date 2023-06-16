---
"@lattice-engine/core": patch
"@lattice-engine/gltf": patch
"@lattice-engine/input": patch
"lattice-engine": patch
"@lattice-engine/physics": patch
"@lattice-engine/render": patch
"@lattice-engine/scene": patch
---

Add pre and post update schedules. This removes all `first()` and `last()` scheduling calls, which was causing some weird bugs.
