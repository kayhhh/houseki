<div align="center">
  <h1>Houseki 💎</h1>
  <strong>A lightweight, modular, and extendable 3D game engine built for the web.</strong>
</div>

## 🕹️ Examples

See the engine live at [houseki.vercel.app](https://houseki.vercel.app/), or dive right in to the [source code](./examples/src/demos/) and see how it works.

## 🤔 Motivation

The web has a lot of independently awesome libraries for building games, but combining them all together can be a pain. Houseki aims to be a lightweight framework for combining these libraries together. To achieve this the engine uses an ECS architecture, allowing for independent systems to work together on same data without coupling. The engine is also highly performant, with speed gains from the ECS architecture and multi-threading via WebWorkers that would be difficult to achieve when using these libraries individually.

## 🏗️ Design Goals

- **Lightweight**: The engine is designed to be lightweight, aiming to be a minimal wrapper around the underlying technologies. We want to avoid adding unnecessary abstractions.
- **Modular**: The engine is designed to be modular, allowing you to pick and choose which systems you want to use.
- **Extendable**: The engine is designed to be extendable, allowing you to easily add your own systems and components.
- **High Performance**: The engine is designed to be highly performant, using an ECS architecture, multi-threading via WebWorkers, and WASM where available.

## 📦 Packages

Packages are published individually to NPM under the `@houseki-engine` scope.
Alternatively, you can install all packages at once using the combined [`houseki`](./packages/houseki) package.

| Package                                                       | Description                                                                                                          |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`@houseki-engine/core`](./packages/core)                     | Core engine, built with [Thyseus](https://github.com/JaimeGensler/thyseus) ECS                                       |
| [`@houseki-engine/csm`](./packages/csm)                       | Cascading shadow maps                                                                                                |
| [`@houseki-engine/gltf`](./packages/gltf)                     | [glTF](https://github.com/KhronosGroup/glTF) import and export                                                       |
| [`@houseki-engine/input`](./packages/input)                   | Components for handling user input                                                                                   |
| [`@houseki-engine/orbit`](./packages/orbit)                   | Orbit controls                                                                                                       |
| [`@houseki-engine/physics`](./packages/physics)               | [Rapier](https://rapier.rs) physics                                                                                  |
| [`@houseki-engine/player`](./packages/player)                 | Player controls                                                                                                      |
| [`@houseki-engine/portal`](./packages/portal)                 | Portals                                                                                                              |
| [`@houseki-engine/postprocessing`](./packages/postprocessing) | [Postprocessing](https://github.com/pmndrs/postprocessing) effects                                                   |
| [`@houseki-engine/render`](./packages/render)                 | [Three.js](https://threejs.org) rendering                                                                            |
| [`@houseki-engine/scene`](./packages/scene)                   | The 3D scene graph                                                                                                   |
| [`@houseki-engine/text`](./packages/text)                     | Text rendering using [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) |
| [`@houseki-engine/transform`](./packages/transform)           | Transform controls                                                                                                   |
| [`@houseki-engine/utils`](./packages/utils)                   | Utility functions                                                                                                    |
| [`@houseki-engine/vrm`](./packages/vrm)                       | [VRM](https://vrm.dev/en) avatars                                                                                    |
| `@houseki-engine/scripting`                                   | [WASM](https://webassembly.org) scripting                                                                            |
| `@houseki-engine/xr`                                          | [WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API) support                                   |
