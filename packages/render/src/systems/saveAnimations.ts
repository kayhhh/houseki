import { KeyframePath, KeyframeTrack, Transform } from "@lattice-engine/scene";
import { Entity, Mut, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

/**
 * Save data modified by animations into the ECS.
 */
export function saveAnimations(
  renderStore: Res<RenderStore>,
  tracks: Query<KeyframeTrack>,
  nodes: Query<[Entity, Mut<Transform>]>
) {
  for (const track of tracks) {
    const targetObject = renderStore.nodes.get(track.targetId);
    if (!targetObject) continue;

    switch (track.path) {
      case KeyframePath.POSITION: {
        for (const [entity, transform] of nodes) {
          if (entity.id !== track.targetId) continue;

          transform.translation.fromObject(targetObject.position);
        }
        break;
      }

      case KeyframePath.ROTATION: {
        for (const [entity, transform] of nodes) {
          if (entity.id !== track.targetId) continue;

          transform.rotation.fromObject(targetObject.quaternion);
        }
        break;
      }

      case KeyframePath.SCALE: {
        for (const [entity, transform] of nodes) {
          if (entity.id !== track.targetId) continue;

          transform.scale.fromObject(targetObject.scale);
        }
        break;
      }

      case KeyframePath.WEIGHTS: {
        break;
      }
    }
  }
}
