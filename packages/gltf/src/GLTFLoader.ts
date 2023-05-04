import {
  Document,
  Mesh as GltfMesh,
  Node as GltfNode,
  Primitive,
  WebIO,
} from "@gltf-transform/core";
import { Entity, System, system } from "@lastolivegames/becsy";
import {
  Geometry,
  Mesh,
  Node,
  Parent,
  resourceStore,
} from "@lattice-engine/core";

import { GltfUri } from "./components";

/**
 * Loads GLTF models into the ECS.
 */
@system
export class GLTFLoader extends System {
  readonly #nodes = this.query((q) => q.with(Node).write);
  readonly #parents = this.query((q) => q.with(Parent).write);
  readonly #geometries = this.query((q) => q.with(Geometry).write);
  readonly #meshes = this.query((q) => q.with(Mesh).write);

  readonly #gltfUrisToLoad = this.query(
    (q) => q.addedOrChanged.with(GltfUri).trackWrites
  );

  readonly #gltfUris = this.query((q) => q.with(GltfUri).current);

  /**
   * Maps a glTF uri -> promise of the read document.
   */
  readonly #docs = new Map<string, Document>();

  /**
   * Set of glTF uris that are currently being read, and have not yet been
   * loaded into the ECS.
   */
  readonly #docsToLoad = new Set<string>();

  override execute() {
    // Start reading any new glTFs
    for (const entity of this.#gltfUrisToLoad.addedOrChanged) {
      const uri = entity.read(GltfUri).uri;

      // Ignore if uri has already been processed
      if (this.#docs.has(uri) || this.#docsToLoad.has(uri)) continue;

      // Mark as needing to be loaded
      this.#docsToLoad.add(uri);

      // Start reading the doc
      const io = new WebIO();
      io.read(uri).then((doc) => this.#docs.set(uri, doc));
    }

    // Load any glTFs that have finished reading
    for (const uri of this.#docsToLoad) {
      const doc = this.#docs.get(uri);
      if (!doc) continue;

      // Remove from set of docs to load
      this.#docsToLoad.delete(uri);

      // Load the glTF into the ECS, for each entity with a matching uri
      for (const entity of this.#gltfUris.current) {
        const gltfUri = entity.read(GltfUri);
        if (gltfUri.uri !== uri) continue;

        processDoc(doc, entity, this);
      }
    }
  }
}

function processDoc(doc: Document, entity: Entity, system: GLTFLoader) {
  const root = doc.getRoot();
  const scene = root.getDefaultScene() ?? root.listScenes()[0];
  if (!scene) return;

  scene.listChildren().forEach((child) => processNode(child, entity, system));
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
  // Create mesh
  const entity = system.createEntity();
  entity.add(Mesh);
  entity.add(Parent, { value: node });

  // Create geometries
  mesh.listPrimitives().forEach((primitive) => {
    const positionId = processAttribute("POSITION", primitive);
    const normalId = processAttribute("NORMAL", primitive);
    const indexId = processAttribute("INDICES", primitive);

    const geometry = system.createEntity();
    geometry.add(Geometry, { indexId, normalId, positionId });
    geometry.add(Parent, { value: entity });
  });
}

/**
 * Loads a primitive attribute into the engine and returns its ID.
 * Can also be used to load indices.
 */
function processAttribute(name: string, primitive: Primitive) {
  const accessor =
    name === "INDICES" ? primitive.getIndices() : primitive.getAttribute(name);
  if (!accessor) return;

  const array = accessor.getArray();
  if (!array) return;

  const id = resourceStore.store(array);
  return id;
}
