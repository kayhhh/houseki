<div align="center">
  <h1>Lattice 💎</h1>
  <strong>A lightweight, modular, and extendable 3D game engine built for the web.</strong>
</div>

## 🕹️ Examples

See the engine live at [lattice-engine.vercel.app](https://lattice-engine.vercel.app/), or dive right in to the [demo source code](./examples/src/demos/) and see how it works.

## 🤔 Motivation

The web has a lot of independently awesome libraries for building games, but combining them all together can be a pain. Lattice aims to be a lightweight framework for combining these libraries together. To achieve this the engine uses an ECS architecture, allowing for independent systems to work together on same data without coupling. The engine is also highly performant, with speed gains from the ECS architecture and multi-threading via WebWorkers that would be difficult to achieve when using these libraries individually.

## 🏗️ Design Goals

- **Lightweight**: The engine is designed to be lightweight, aiming to be a minimal wrapper around the underlying technologies. We want to avoid adding unnecessary abstractions.
- **Modular**: The engine is designed to be modular, allowing you to pick and choose which systems you want to use.
- **Extendable**: The engine is designed to be extendable, allowing you to easily add your own systems and components.
- **High Performance**: The engine is designed to be highly performant, using an ECS architecture, multi-threading via WebWorkers, and WASM where available.

## 📦 Packages

Packages are published individually to NPM under the `@lattice-engine` scope. Alternatively, you can install all packages at once using the combined [`lattice-engine`](./packages/lattice-engine) package.

| Package                                         | Description                                                                             |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`@lattice-engine/core`](./packages/core)       | Core engine, built with [Thyseus](https://github.com/JaimeGensler/thyseus) ECS          |
| [`@lattice-engine/gltf`](./packages/gltf)       | [glTF](https://github.com/KhronosGroup/glTF) import and export                          |
| [`@lattice-engine/input`](./packages/input)     | Components for handling user input                                                      |
| [`@lattice-engine/orbit`](./packages/orbit)     | Orbit controls                                                                          |
| [`@lattice-engine/physics`](./packages/physics) | [Rapier](https://rapier.rs) physics                                                     |
| [`@lattice-engine/player`](./packages/player)   | Player controls                                                                         |
| [`@lattice-engine/render`](./packages/render)   | [Three.js](https://threejs.org) rendering                                               |
| [`@lattice-engine/scene`](./packages/scene)     | The 3D scene graph                                                                      |
| [`@lattice-engine/utils`](./packages/utils)     | Utility functions                                                                       |
| [`@lattice-engine/vrm`](./packages/vrm)         | [VRM](https://vrm.dev/en) avatars                                                       |
| `@lattice-engine/scripting`                     | [WASM](https://webassembly.org) scripting                                               |
| `@lattice-engine/wired-protocol`                | Multiplayer networking via [The Wired Protocol](https://github.com/wired-protocol/spec) |
| `@lattice-engine/xr`                            | [WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API) support      |
