import {
  IsNode,
  Parent,
  Position,
  Rotation,
  Scale,
} from "@lattice-engine/core";
import { Object3D } from "three";
import { defineSystem, Entity } from "thyseus";

import { RenderStore } from "../RenderStore";

export const nodeBuilder = defineSystem(
  ({ Res, Query, Optional, With }) => [
    Res(RenderStore),
    Query(
      [
        Entity,
        Optional(Parent),
        Optional(Position),
        Optional(Rotation),
        Optional(Scale),
      ],
      With(IsNode)
    ),
  ],
  (store, entities) => {
    const ids: bigint[] = [];

    for (const [{ id }, parent, position, rotation, scale] of entities) {
      ids.push(id);

      let object = store.nodes.get(id);

      // Create new objects
      if (!object) {
        object = new Object3D();
        store.nodes.set(id, object);
      }

      // Sync object properties
      if (parent) {
        const parentObject =
          store.nodes.get(parent.id) ?? store.scenes.get(parent.id);

        if (parentObject) parentObject.add(object);
        else object.removeFromParent();
      } else {
        object.removeFromParent();
      }

      if (position) object.position.set(position.x, position.y, position.z);
      else object.position.set(0, 0, 0);

      if (rotation)
        object.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      else object.quaternion.set(0, 0, 0, 1);

      if (scale) object.scale.set(scale.x, scale.y, scale.z);
      else object.scale.set(1, 1, 1);
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
);
