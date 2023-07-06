# @lattice-engine/gltf

## 1.0.0

### Minor Changes

- e2015e3: add Name component

### Patch Changes

- Updated dependencies [e2015e3]
  - @lattice-engine/scene@0.4.0
  - @lattice-engine/physics@1.0.0

## 0.5.1

### Patch Changes

- cc0fc73: upgrade thyseus
- Updated dependencies [cc0fc73]
  - @lattice-engine/core@0.2.1
  - @lattice-engine/physics@0.3.1
  - @lattice-engine/scene@0.3.1

## 0.5.0

### Patch Changes

- d188f58: fix texture transform export
- Updated dependencies [589fac4]
  - @lattice-engine/core@0.2.0
  - @lattice-engine/physics@0.3.0
  - @lattice-engine/scene@0.3.0

## 0.4.0

### Minor Changes

- 93c1536: add support for multiple uv maps
- 93c1536: fix animation import
- Updated dependencies [93c1536]
  - @lattice-engine/scene@0.2.0
  - @lattice-engine/physics@0.2.0

## 0.3.3

### Patch Changes

- fddc570: Add pre and post update schedules. This removes all `first()` and `last()` scheduling calls, which was causing some weird bugs.
- Updated dependencies [fddc570]
  - @lattice-engine/core@0.1.1
  - @lattice-engine/physics@0.1.1
  - @lattice-engine/scene@0.1.1

## 0.3.2

### Patch Changes

- 3a1173d: No longer include draco scripts with package, just leave it up to the user to figure out.

## 0.3.1

### Patch Changes

- ae20bb2: Include wasm files in export, no longer inlines them into base64.

## 0.3.0

### Minor Changes

- 938febf: Include draco encoder / decoder automatically with the package
