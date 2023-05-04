<div align="center">
  <h1>Lattice 💎</h1>
  <strong>A lightweight, modular, and extendable 3D game engine built for the web.</strong>
</div>

## 🤔 Motivation

The web has a lot of independently awesome libraries for building games, but combining them all together can be a pain. Lattice aims to be a lightweight game framework for combining these libraries together - all while maintaining high performance via an Entity Component System (ECS), multi-threading using WebWorkers, and WebAssembly. Add physics or networking only if you need it, or add custom rendering components to suit your specific needs.

## 🏗️ Design Goals

- **Lightweight**: The engine is designed to be lightweight, aiming to be a minimal wrapper around the underlying technologies. We want to avoid adding unnecessary abstractions.
- **Modular**: The engine is designed to be modular, allowing you to pick and choose which systems you want to use.
- **Extendable**: The engine is designed to be extendable, allowing you to easily add your own systems and components.
- **Isolated**: The engine is designed for running multiple isolated scenes in parallel, allowing for the safe execution of untrusted code.
- **High Performance**: The engine is designed to be high performance, achieved through the use of an ECS architecture, WASM scripting, and WebWorkers.

## ⚡ Tech Stack

- [Becsy](https://lastolivegames.github.io/becsy/guide/introduction.html) for ECS
- [Three.js](https://threejs.org/) for 3D rendering
- [Rapier](https://rapier.rs/) for physics
- [WASM](https://webassembly.org/) for user scripting

## 📦 Packages

| Package                                       | Description                                                                             |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`@lattice-engine/core`](./packages/core)     | Core engine                                                                             |
| [`@lattice-engine/gltf`](./packages/gltf)     | GLTF import and export                                                                  |
| [`@lattice-engine/render`](./packages/render) | Three.js rendering                                                                      |
| `@lattice-engine/physics`                     | Rapier physics                                                                          |
| `@lattice-engine/player-controls`             | Player controls for first-person and third-person cameras                               |
| `@lattice-engine/scripting`                   | WASM scripting                                                                          |
| `@lattice-engine/wired-protocol`              | Multiplayer networking via the [Wired Protocol](https://github.com/wired-protocol/spec) |
