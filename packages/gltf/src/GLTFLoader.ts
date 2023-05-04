import {
  Mesh as GltfMesh,
  Node as GltfNode,
  WebIO,
} from "@gltf-transform/core";
import { Entity, System, system } from "@lastolivegames/becsy";
import { Geometry, Node, Parent } from "@lattice-engine/core";

import { GltfUri } from "./components";

/**
 * Loads GLTF files into the ECS.
 */
@system
export class GLTFLoader extends System {
  readonly #nodes = this.query((q) => q.with(Node).write);

  readonly #gltfUrisToLoad = this.query((q) => q.addedOrChanged.with(GltfUri));

  #io = new WebIO();

  override execute() {
    // Load new GltfUris
    for (const entity of this.#gltfUrisToLoad.addedOrChanged) {
      this.load(entity.hold());
    }
  }

  /**
   * Loads a glTF into the ECS. This will attach the scene to the given entity.
   * @param entity An entity with a `GltfUri` component.
   */
  async load(entity: Entity) {
    const uri = entity.read(GltfUri).uri;
    const doc = await this.#io.read(uri);

    const root = doc.getRoot();
    const scene = root.getDefaultScene() ?? root.listScenes()[0];
    if (!scene) return;

    scene.listChildren().forEach((child) => processNode(child, entity, this));
  }

  /**
   * Stores a resource in the ResourceStore.
   */
  store() {}
}

/**
 * Recursively processes a GLTF node and its children.
 */
function processNode(node: GltfNode, parent: Entity, system: GLTFLoader) {
  const position = node.getTranslation();
  const rotation = node.getRotation();
  const scale = node.getScale();

  const entity = system.createEntity();
  entity.add(Node, { position, rotation, scale });
  entity.add(Parent, { value: parent });

  const mesh = node.getMesh();
  if (mesh) processMesh(mesh, entity, system);

  node.listChildren().forEach((child) => processNode(child, entity, system));
}

function processMesh(mesh: GltfMesh, node: Entity, system: GLTFLoader) {
  const entity = system.createEntity();

  // Create geometries
  mesh.listPrimitives().forEach((primitive) => {
    const position = primitive.getAttribute("POSITION");
    const normal = primitive.getAttribute("NORMAL");
    const indices = primitive.getIndices();

    const primitiveEntity = system.createEntity();
    primitiveEntity.add(Geometry);
  });
}
