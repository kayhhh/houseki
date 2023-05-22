import { PerspectiveCamera, Position, Rotation } from "@lattice-engine/scene";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { Entity, Query, Res, With } from "thyseus";

import { RenderStore } from "../RenderStore";

/**
 * Creates and updates perspective camera objects.
 */
export function createCameras(
  store: Res<RenderStore>,
  cameras: Query<[Entity, PerspectiveCamera]>,
  withPosition: Query<[Entity, Position], With<PerspectiveCamera>>,
  withRotation: Query<[Entity, Rotation], With<PerspectiveCamera>>
) {
  const ids: bigint[] = [];

  for (const [{ id }, camera] of cameras) {
    ids.push(id);

    let object = store.perspectiveCameras.get(id);

    // Create new objects
    if (!object) {
      object = new ThreePerspectiveCamera();
      store.perspectiveCameras.set(id, object);
    }

    // Sync object properties
    const canvas = store.renderer.domElement;
    object.aspect = canvas.width / canvas.height;
    object.updateProjectionMatrix();

    object.fov = camera.fov;
    object.near = camera.near;
    object.far = camera.far;
  }

  // Sync object positions
  for (const [{ id }, position] of withPosition) {
    const object = store.perspectiveCameras.get(id);
    if (object) object.position.set(position.x, position.y, position.z);
  }

  // Sync object rotations
  for (const [{ id }, rotation] of withRotation) {
    const object = store.perspectiveCameras.get(id);
    if (object)
      object.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  }

  // Remove objects that no longer exist
  for (const [id] of store.perspectiveCameras) {
    if (!ids.includes(id)) store.perspectiveCameras.delete(id);
  }
}
