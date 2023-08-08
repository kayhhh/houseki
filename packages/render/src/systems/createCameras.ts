import { Parent, PerspectiveCamera, Transform } from "@lattice-engine/scene";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { Entity, Query, Res, With } from "thyseus";

import { RenderStore } from "../resources";

/**
 * Creates and updates perspective camera objects.
 */
export function createCameras(
  store: Res<RenderStore>,
  cameras: Query<[Entity, PerspectiveCamera, Transform]>,
  withParent: Query<[Entity, Parent], With<PerspectiveCamera>>,
) {
  const ids: bigint[] = [];

  for (const [entity, camera, transform] of cameras) {
    ids.push(entity.id);

    let object = store.perspectiveCameras.get(entity.id);

    // Create new objects
    if (!object) {
      object = new ThreePerspectiveCamera();
      store.perspectiveCameras.set(entity.id, object);
    }

    // Sync object properties
    const canvas = store.renderer.domElement;
    object.aspect = canvas.width / canvas.height;
    object.updateProjectionMatrix();

    object.fov = camera.fov;
    object.near = camera.near;
    object.far = camera.far;

    object.position.set(
      transform.translation.x,
      transform.translation.y,
      transform.translation.z,
    );
    object.quaternion.set(
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z,
      transform.rotation.w,
    );
  }

  // Sync object parents
  for (const [entity, parent] of withParent) {
    const object = store.perspectiveCameras.get(entity.id);
    const parentObject = store.nodes.get(parent.id);
    if (object && parentObject) parentObject.add(object);
  }

  // Remove objects that no longer exist
  for (const [id] of store.perspectiveCameras) {
    if (!ids.includes(id)) {
      const object = store.perspectiveCameras.get(id);
      if (object) object.removeFromParent();

      store.perspectiveCameras.delete(id);
    }
  }
}
