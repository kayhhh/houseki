# @lattice-engine/n8ao

[SSAO](https://en.wikipedia.org/wiki/Screen_space_ambient_occlusion) using [N8AO](https://github.com/N8python/n8ao).

## Usage

To add a N8AO pass to your render, just spawn in an entity with the `N8AOPass` component.

```ts
import { N8AOPass } from "@lattice-engine/n8ao";

function mySystem(commands: Commands) {
  commands.spawn().add(new N8AOPass());
}
```
