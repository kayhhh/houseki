<div align="center">
  <h1>Lattice 💎</h1>
  <strong>A lightweight, modular, and extendable 3D game engine built for the web.</strong>
</div>

## 🤔 Motivation

The web has a lot of independently awesome libraries for building games, but combining them all together can be a pain. Lattice aims to be a lightweight game framework for combining these libraries together. To achieve this the engine uses an ECS architecture, allowing for independent systems to work together on same data without coupling. The engine is also highly performant, with speed gains from the ECS architecture and multi-threading via WebWorkers that would be difficult to achieve when using these libraries individually.

## 🏗️ Design Goals

- **Lightweight**: The engine is designed to be lightweight, aiming to be a minimal wrapper around the underlying technologies. We want to avoid adding unnecessary abstractions.
- **Modular**: The engine is designed to be modular, allowing you to pick and choose which systems you want to use.
- **Extendable**: The engine is designed to be extendable, allowing you to easily add your own systems and components.
- **High Performance**: The engine is designed to be high performance, achieved through the use of an ECS architecture, WASM scripting, and WebWorkers.

## 📦 Packages

| Package                                       | Description                                                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [`@lattice-engine/core`](./packages/core)     | Core engine, built with [Becsy](https://lastolivegames.github.io/becsy/guide/introduction.html) ECS |
| [`@lattice-engine/gltf`](./packages/gltf)     | [glTF](https://github.com/KhronosGroup/glTF) import and export                                      |
| [`@lattice-engine/render`](./packages/render) | [Three.js](https://threejs.org/) rendering                                                          |
| `@lattice-engine/physics`                     | [Rapier](https://rapier.rs/) physics                                                                |
| `@lattice-engine/player-controls`             | Player controls for first-person and third-person cameras                                           |
| `@lattice-engine/scripting`                   | [WASM](https://webassembly.org/) scripting                                                          |
| `@lattice-engine/wired-protocol`              | Multiplayer networking via the [Wired Protocol](https://github.com/wired-protocol/spec)             |
