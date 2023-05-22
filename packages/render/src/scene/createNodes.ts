import { Node, Parent, Position, Rotation, Scale } from "@lattice-engine/scene";
import { Object3D } from "three";
import { Entity, Query, Res, With } from "thyseus";

import { RenderStore } from "../RenderStore";

/**
 * Creates and updates node objects.
 */
export function createNodes(
  store: Res<RenderStore>,
  entities: Query<Entity, With<Node>>,
  withPosition: Query<[Entity, Position], With<Node>>,
  withRotation: Query<[Entity, Rotation], With<Node>>,
  withScale: Query<[Entity, Scale], With<Node>>,
  withParent: Query<[Entity, Parent], With<Node>>
) {
  const ids: bigint[] = [];

  for (const { id } of entities) {
    ids.push(id);

    // Create new objects
    if (!store.nodes.has(id)) {
      const object = new Object3D();
      store.nodes.set(id, object);
    }
  }

  // Sync object properties
  for (const [{ id }, position] of withPosition) {
    const object = store.nodes.get(id);
    if (object) object.position.set(position.x, position.y, position.z);
  }

  for (const [{ id }, rotation] of withRotation) {
    const object = store.nodes.get(id);
    if (object)
      object.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  }

  for (const [{ id }, scale] of withScale) {
    const object = store.nodes.get(id);
    if (object) object.scale.set(scale.x, scale.y, scale.z);
  }

  for (const [{ id }, parent] of withParent) {
    const object = store.nodes.get(id);
    if (object) {
      const parentObject =
        store.nodes.get(parent.id) ?? store.scenes.get(parent.id);

      if (parentObject) parentObject.add(object);
    }
  }

  // Remove objects that no longer exist
  for (const [id] of store.nodes) {
    if (!ids.includes(id)) {
      const object = store.nodes.get(id);
      object?.removeFromParent();

      store.nodes.delete(id);
    }
  }
}
