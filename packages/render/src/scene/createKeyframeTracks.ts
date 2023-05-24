import { Warehouse } from "@lattice-engine/core";
import { AnimationPath, KeyframeTrack } from "@lattice-engine/scene";
import { KeyframeTrack as ThreeKeyframeTrack } from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../RenderStore";

export function createKeyframeTracks(
  warehouse: Res<Warehouse>,
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, KeyframeTrack]>
) {
  const ids: bigint[] = [];

  for (const [entity, track] of entities) {
    ids.push(entity.id);

    const times = track.times.read(warehouse);
    const values = track.values.read(warehouse);

    const targetObject = renderStore.nodes.get(track.targetId);
    if (!targetObject) continue;

    let threePath = "";

    switch (track.path) {
      case AnimationPath.POSITION: {
        threePath = "position";
        break;
      }

      case AnimationPath.ROTATION: {
        threePath = "quaternion";
        break;
      }

      case AnimationPath.SCALE: {
        threePath = "scale";
        break;
      }

      case AnimationPath.WEIGHTS: {
        threePath = "morphTargetInfluences";
        break;
      }
    }

    const trackName = `${targetObject.uuid}.${threePath}`;

    let object = renderStore.keyframeTracks.get(entity.id);

    // Create new objects
    if (!object) {
      // Skip empty tracks
      if (times.length === 0 || values.length === 0) continue;

      object = new ThreeKeyframeTrack(trackName, times, values);
      renderStore.keyframeTracks.set(entity.id, object);
    }

    // Sync object properties
    object.name = trackName;
    object.times = times;
    object.values = values;
  }

  // Remove deleted objects from the store
  for (const [id] of renderStore.keyframeTracks) {
    if (!ids.includes(id)) {
      renderStore.keyframeTracks.delete(id);
    }
  }
}
