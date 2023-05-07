import { IsScene } from "@lattice-engine/core";
import { AmbientLight, PointLight, Scene as ThreeScene } from "three";
import { defineSystem, Entity } from "thyseus";

import { RenderStore } from "../RenderStore";

export const sceneBuilder = defineSystem(
  ({ Res, Query, With }) => [Res(RenderStore), Query(Entity, With(IsScene))],
  (store, scenes) => {
    const ids: bigint[] = [];

    for (const { id } of scenes) {
      ids.push(id);

      let object = store.scenes.get(id);

      // Create new objects
      if (!object) {
        object = new ThreeScene();
        object.add(new AmbientLight(0xffffff, 0.5));
        object.add(new PointLight(0xffffff, 0.5));

        store.scenes.set(id, object);
      }
    }

    // Remove objects that no longer exist
    for (const [id] of store.scenes) {
      if (!ids.includes(id)) store.scenes.delete(id);
    }
  }
);
