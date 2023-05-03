# Lattice

A lightweight, modular, and extendable 3D game engine built for the web.

## Desgin Goals

- **Lightweight**: The engine is designed to be lightweight, aiming to be a minimal wrapper around the underlying technologies. We want to avoid adding unnecessary abstractions.
- **Modular**: The engine is designed to be modular, allowing you to pick and choose which systems you want to use. This also allows for granular hot reloading, as you can modify and reload individual systems without having to reload the entire engine.
- **Extendable**: The engine is designed to be extendable, allowing you to easily add your own systems and components.
- **Isolated**: The engine is designed for running multiple isolated scenes in parallel, allowing for the safe execution of untrusted code.
- **High Performance**: The engine is designed to be high performance, achieved through the use of an ECS architecture, WASM scripting, and WebWorkers.

## Tech Stack

- [Becsy](https://lastolivegames.github.io/becsy/guide/introduction.html) for ECS
- [Three.js](https://threejs.org/) for 3D rendering
- [Rapier](https://rapier.rs/) for physics
- [WASM](https://webassembly.org/) for user scripting
