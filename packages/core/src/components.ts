import { component, field } from "@lastolivegames/becsy";

@component
export class Canvas {
  @field.object declare node: HTMLCanvasElement;
}

@component
export class Scene {
  @field.ref declare root: Node;
}

@component
export class Node {
  @field.float32.vector(3) declare position: number[];
  @field.float32.vector(4) declare rotation: number[];
  @field.float32.vector(3) declare scale: number[];
  @field.ref declare parent: Node;
  @field.ref declare mesh: Mesh;
}

@component
export class Mesh {
  @field.ref declare material: Material;
}

@component
export class Material {
  @field.float32.vector(4) declare color: number[];
}
