import { component, field } from "@lastolivegames/becsy";

@component
export class SceneObject {
  @field.object declare object: THREE.Scene;
}

@component
export class PerspectiveCameraObject {
  @field.object declare object: THREE.PerspectiveCamera;
}

@component
export class NodeObject {
  @field.object declare object: THREE.Object3D;
}

@component
export class MeshObject {
  @field.object declare object: THREE.Mesh;
}

@component
export class GeometryObject {
  @field.object declare object: THREE.BufferGeometry;
}

@component
export class MaterialObject {
  @field.object declare object: THREE.Material;
}
