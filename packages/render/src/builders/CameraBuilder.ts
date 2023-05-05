import { System, system } from "@lastolivegames/becsy";
import { PerspectiveCamera } from "@lattice-engine/core";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";

import { PerspectiveCameraObject } from "../components";
import { Renderer } from "../Renderer";

/**
 * Converts Camera components to Three.js objects.
 */
@system((s) => s.before(Renderer))
export class CameraBuilder extends System {
  readonly #objects = this.query((q) => q.with(PerspectiveCameraObject).write);

  readonly #addedCameras = this.query((q) => q.added.with(PerspectiveCamera));
  readonly #addedOrChangedCameras = this.query(
    (q) => q.addedOrChanged.with(PerspectiveCamera).trackWrites
  );
  readonly #removedCameras = this.query((q) =>
    q.removed.with(PerspectiveCamera)
  );

  override execute() {
    // Create objects
    for (const entity of this.#addedCameras.added) {
      entity.add(PerspectiveCameraObject, {
        object: new ThreePerspectiveCamera(),
      });
    }

    // Sync objects
    for (const entity of this.#addedOrChangedCameras.addedOrChanged) {
      const camera = entity.read(PerspectiveCamera);
      const object = entity.read(PerspectiveCameraObject).object;

      object.fov = camera.fov;
      object.near = camera.near;
      object.far = camera.far;
    }

    // Remove objects
    for (const entity of this.#removedCameras.removed) {
      const object = entity.read(PerspectiveCameraObject).object;
      object.removeFromParent();
      object.clear();

      entity.remove(PerspectiveCameraObject);
    }
  }
}
