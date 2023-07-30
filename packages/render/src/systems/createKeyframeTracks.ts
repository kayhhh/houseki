import { Warehouse } from "@lattice-engine/core";
import {
  KeyframeInterpolation,
  KeyframePath,
  KeyframeTrack,
} from "@lattice-engine/scene";
import {
  InterpolateDiscrete,
  InterpolateLinear,
  InterpolationModes,
  NumberKeyframeTrack,
  QuaternionKeyframeTrack,
  VectorKeyframeTrack,
} from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";
import { setCubicSpline } from "../utils/CubicSplineInterpolation";

export function createKeyframeTracks(
  warehouse: Res<Warehouse>,
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, KeyframeTrack]>
) {
  const ids: bigint[] = [];

  for (const [entity, track] of entities) {
    const times = track.times.read(warehouse);
    const values = track.values.read(warehouse);

    // Skip empty tracks
    if (!times?.length || !values?.length) continue;

    const targetObject = renderStore.nodes.get(track.targetId);
    if (!targetObject) continue;

    ids.push(entity.id);

    let threePath = "";
    let TypedKeyframeTrack:
      | typeof NumberKeyframeTrack
      | typeof VectorKeyframeTrack
      | typeof QuaternionKeyframeTrack;

    switch (track.path) {
      case KeyframePath.POSITION: {
        threePath = "position";
        TypedKeyframeTrack = VectorKeyframeTrack;
        break;
      }

      case KeyframePath.ROTATION: {
        threePath = "quaternion";
        TypedKeyframeTrack = QuaternionKeyframeTrack;
        break;
      }

      case KeyframePath.SCALE: {
        threePath = "scale";
        TypedKeyframeTrack = VectorKeyframeTrack;
        break;
      }

      case KeyframePath.WEIGHTS: {
        threePath = "morphTargetInfluences";
        TypedKeyframeTrack = NumberKeyframeTrack;
        break;
      }

      default: {
        throw new Error("Invalid path", track.path);
      }
    }

    const trackName = `${targetObject.uuid}.${threePath}`;

    let interpolation: InterpolationModes | undefined;

    switch (track.interpolation) {
      case KeyframeInterpolation.LINEAR: {
        interpolation = InterpolateLinear;
        break;
      }

      case KeyframeInterpolation.STEP: {
        interpolation = InterpolateDiscrete;
        break;
      }
    }

    let object = renderStore.keyframeTracks.get(entity.id);

    // Create new objects
    if (!object) {
      object = new TypedKeyframeTrack(trackName, times, values, interpolation);
      renderStore.keyframeTracks.set(entity.id, object);
    }

    // Sync object properties
    object.name = trackName;
    object.times = times;
    object.values = values;

    if (object.getInterpolation() !== interpolation) {
      if (!interpolation) setCubicSpline(object);
      else object.setInterpolation(interpolation);
    }
  }

  // Remove deleted objects from the store
  for (const [id] of renderStore.keyframeTracks) {
    if (!ids.includes(id)) {
      renderStore.keyframeTracks.delete(id);
    }
  }
}
