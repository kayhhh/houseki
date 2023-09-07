<div align="center">
  <h1>Reddo 💎</h1>
  <strong>A lightweight, modular, and extendable 3D game engine built for the web.</strong>
</div>

## 🕹️ Examples

See the engine live at [reddo.vercel.app](https://reddo.vercel.app/), or dive right in to the [source code](./examples/src/demos/) and see how it works.

## 🤔 Motivation

The web has a lot of independently awesome libraries for building games, but combining them all together can be a pain. Reddo aims to be a lightweight framework for combining these libraries together. To achieve this the engine uses an ECS architecture, allowing for independent systems to work together on same data without coupling. The engine is also highly performant, with speed gains from the ECS architecture and multi-threading via WebWorkers that would be difficult to achieve when using these libraries individually.

## 🏗️ Design Goals

- **Lightweight**: The engine is designed to be lightweight, aiming to be a minimal wrapper around the underlying technologies. We want to avoid adding unnecessary abstractions.
- **Modular**: The engine is designed to be modular, allowing you to pick and choose which systems you want to use.
- **Extendable**: The engine is designed to be extendable, allowing you to easily add your own systems and components.
- **High Performance**: The engine is designed to be highly performant, using an ECS architecture, multi-threading via WebWorkers, and WASM where available.

## 📦 Packages

Packages are published individually to NPM under the `@reddo` scope. Alternatively, you can install all packages at once using the combined [`reddo`](./packages/reddo) package.

| Package                                              | Description                                                                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`@reddo/core`](./packages/core)                     | Core engine, built with [Thyseus](https://github.com/JaimeGensler/thyseus) ECS                                       |
| [`@reddo/csm`](./packages/csm)                       | Cascading shadow maps                                                                                                |
| [`@reddo/gltf`](./packages/gltf)                     | [glTF](https://github.com/KhronosGroup/glTF) import and export                                                       |
| [`@reddo/input`](./packages/input)                   | Components for handling user input                                                                                   |
| [`@reddo/orbit`](./packages/orbit)                   | Orbit controls                                                                                                       |
| [`@reddo/physics`](./packages/physics)               | [Rapier](https://rapier.rs) physics                                                                                  |
| [`@reddo/player`](./packages/player)                 | Player controls                                                                                                      |
| [`@reddo/portal`](./packages/portal)                 | Portals                                                                                                              |
| [`@reddo/postprocessing`](./packages/postprocessing) | [Postprocessing](https://github.com/pmndrs/postprocessing) effects                                                   |
| [`@reddo/render`](./packages/render)                 | [Three.js](https://threejs.org) rendering                                                                            |
| [`@reddo/scene`](./packages/scene)                   | The 3D scene graph                                                                                                   |
| [`@reddo/text`](./packages/text)                     | Text rendering using [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) |
| [`@reddo/transform`](./packages/transform)           | Transform controls                                                                                                   |
| [`@reddo/utils`](./packages/utils)                   | Utility functions                                                                                                    |
| [`@reddo/vrm`](./packages/vrm)                       | [VRM](https://vrm.dev/en) avatars                                                                                    |
| `@reddo/scripting`                                   | [WASM](https://webassembly.org) scripting                                                                            |
| `@reddo/xr`                                          | [WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API) support                                   |
