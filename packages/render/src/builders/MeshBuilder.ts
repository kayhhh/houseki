import { System, system } from "@lastolivegames/becsy";
import { Mesh } from "@lattice-engine/core";
import { Mesh as ThreeMesh, MeshStandardMaterial } from "three";

import { GeometryObject, MeshObject, NodeObject } from "../components";
import { Renderer } from "../Renderer";

/**
 * Converts Mesh components to Three.js objects.
 */
@system((s) => s.before(Renderer))
export class MeshBuilder extends System {
  readonly #objects = this.query((q) => q.with(MeshObject).write);
  readonly #nodeObjects = this.query((q) => q.with(NodeObject));

  readonly #addedMeshes = this.query((q) => q.added.with(Mesh));
  readonly #addedOrChangedMeshes = this.query(
    (q) => q.addedOrChanged.with(Mesh).trackWrites
  );
  readonly #removedMeshes = this.query((q) => q.removed.with(Mesh));

  readonly #addedOrChangedGeometries = this.query(
    (q) => q.addedOrChanged.with(GeometryObject).trackWrites
  );

  override execute() {
    // Create objects
    for (const entity of this.#addedMeshes.added) {
      const object = new ThreeMesh(undefined, new MeshStandardMaterial());
      entity.add(MeshObject, { object });
    }

    // Sync objects
    for (const entity of this.#addedOrChangedMeshes.addedOrChanged) {
      const object = entity.read(MeshObject).object;

      if (entity.has(NodeObject)) {
        const nodeObject = entity.read(NodeObject).object;
        nodeObject.add(object);
      } else {
        object.removeFromParent();
      }
    }

    // Add geometries
    for (const entity of this.#addedOrChangedGeometries.addedOrChanged) {
      const object = entity.read(GeometryObject).object;

      if (entity.has(MeshObject)) {
        // Add geometry to mesh
        const meshObject = entity.read(MeshObject).object;
        meshObject.geometry = object;
      }
    }

    // Remove objects
    for (const entity of this.#removedMeshes.removed) {
      const object = entity.read(MeshObject).object;
      object.removeFromParent();
      object.clear();

      entity.remove(MeshObject);
    }
  }
}
