import {
  IsNode,
  Parent,
  Position,
  Rotation,
  Scale,
} from "@lattice-engine/scene";
import { Object3D } from "three";
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

export function nodeBuilder(
  store: Res<RenderStore>,
  entities: Query<Entity, With<IsNode>>,
  withPosition: Query<[Entity, Position], With<IsNode>>,
  withRotation: Query<[Entity, Rotation], With<IsNode>>,
  withScale: Query<[Entity, Scale], With<IsNode>>,
  withParent: Query<[Entity, Parent], With<IsNode>>
) {
  const ids: bigint[] = [];

  for (const { id } of entities) {
    ids.push(id);

    let object = store.nodes.get(id);

    // Create new objects
    if (!object) {
      object = new Object3D();
      store.nodes.set(id, object);
    }

    // Reset object properties
    object.position.set(0, 0, 0);
    object.quaternion.set(0, 0, 0, 1);
    object.scale.set(1, 1, 1);
    object.removeFromParent();
  }

  // Sync object properties
  for (const [{ id }, position] of withPosition) {
    const object = store.nodes.get(id);
    if (object && position)
      object.position.set(position.x, position.y, position.z);
  }

  for (const [{ id }, rotation] of withRotation) {
    const object = store.nodes.get(id);
    if (object && rotation)
      object.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  }

  for (const [{ id }, scale] of withScale) {
    const object = store.nodes.get(id);
    if (object && scale) object.scale.set(scale.x, scale.y, scale.z);
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

nodeBuilder.parameters = [
  ResourceDescriptor(RenderStore),
  QueryDescriptor(Entity, WithDescriptor(IsNode)),
  QueryDescriptor([Entity, Position], WithDescriptor(IsNode)),
  QueryDescriptor([Entity, Rotation], WithDescriptor(IsNode)),
  QueryDescriptor([Entity, Scale], WithDescriptor(IsNode)),
  QueryDescriptor([Entity, Parent], WithDescriptor(IsNode)),
];
