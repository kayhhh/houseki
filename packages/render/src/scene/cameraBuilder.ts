import { PerspectiveCamera, Position } from "@lattice-engine/scene";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import {
  Entity,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
  With,
  WithDescriptor,
} from "thyseus";

import { RenderStore } from "../RenderStore";

/**
 * Syncs PerspectiveCamera components with Three.js PerspectiveCamera objects.
 */
export function cameraBuilder(
  store: Res<RenderStore>,
  cameras: Query<[PerspectiveCamera, Entity]>,
  withPosition: Query<[Entity, Position], With<PerspectiveCamera>>
) {
  const ids: bigint[] = [];

  for (const [camera, { id }] of cameras) {
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

    object.position.set(0, 0, 0);
  }

  // Sync object positions
  for (const [{ id }, position] of withPosition) {
    const object = store.perspectiveCameras.get(id);
    if (object) object.position.set(position.x, position.y, position.z);
  }

  // Remove objects that no longer exist
  for (const [id] of store.perspectiveCameras) {
    if (!ids.includes(id)) store.perspectiveCameras.delete(id);
  }
}

cameraBuilder.parameters = [
  ResourceDescriptor(RenderStore),
  QueryDescriptor([PerspectiveCamera, Entity]),
  QueryDescriptor([Entity, Position], WithDescriptor(PerspectiveCamera)),
];
