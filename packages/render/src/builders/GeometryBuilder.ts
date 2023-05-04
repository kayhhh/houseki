import { System, system } from "@lastolivegames/becsy";
import { Geometry, resourceStore } from "@lattice-engine/core";
import { BufferAttribute, BufferGeometry } from "three";

import { GeometryObject } from "../components";
import { Renderer } from "../Renderer";

/**
 * Converts Geometry components to Three.js objects.
 */
@system((s) => s.before(Renderer))
export class GeometryBuilder extends System {
  readonly #objects = this.query((q) => q.with(GeometryObject).write);

  readonly #addedGeometries = this.query((q) => q.added.with(Geometry));
  readonly #addedOrChangedGeometries = this.query(
    (q) => q.addedOrChanged.with(Geometry).trackWrites
  );
  readonly #removedGeometries = this.query((q) => q.removed.with(Geometry));

  override execute() {
    // Create objects
    for (const entity of this.#addedGeometries.added) {
      const object = new BufferGeometry();
      entity.add(GeometryObject, { object });
    }

    // Sync objects
    for (const entity of this.#addedOrChangedGeometries.addedOrChanged) {
      const geometry = entity.read(Geometry);
      const object = entity.read(GeometryObject).object;

      const index = resourceStore.get(geometry.indexId);
      const position = resourceStore.get(geometry.positionId);
      const normal = resourceStore.get(geometry.normalId);
      const uv = resourceStore.get(geometry.uvId);

      if (index) {
        const attribute = new BufferAttribute(index, 1);
        object.setIndex(attribute);
      }

      if (position) {
        const attribute = new BufferAttribute(position, 3);
        object.setAttribute("position", attribute);
      }

      if (normal) {
        const attribute = new BufferAttribute(normal, 3);
        object.setAttribute("normal", attribute);
      }

      if (uv) {
        const attribute = new BufferAttribute(uv, 2);
        object.setAttribute("uv", attribute);
      }
    }

    // Remove objects
    for (const entity of this.#removedGeometries.removed) {
      const object = entity.read(GeometryObject).object;
      object.dispose();

      entity.remove(GeometryObject);
    }
  }
}
