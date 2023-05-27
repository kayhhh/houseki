import {
  KeyframePath,
  KeyframeTrack,
  Node,
  Position,
  Rotation,
  Scale,
} from "@lattice-engine/scene";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { RenderStore } from "../RenderStore";

/**
 * Save data modified by animations into the ECS.
 */
export function saveAnimations(
  renderStore: Res<RenderStore>,
  tracks: Query<KeyframeTrack>,
  nodePositions: Query<[Entity, Mut<Position>], With<Node>>,
  nodeRotations: Query<[Entity, Mut<Rotation>], With<Node>>,
  nodeScales: Query<[Entity, Mut<Scale>], With<Node>>
) {
  for (const track of tracks) {
    const targetObject = renderStore.nodes.get(track.targetId);
    if (!targetObject) continue;

    switch (track.path) {
      case KeyframePath.POSITION: {
        for (const [nodeEntity, nodePosition] of nodePositions) {
          if (nodeEntity.id !== track.targetId) continue;

          nodePosition.x = targetObject.position.x;
          nodePosition.y = targetObject.position.y;
          nodePosition.z = targetObject.position.z;
        }
        break;
      }

      case KeyframePath.ROTATION: {
        for (const [nodeEntity, nodeRotation] of nodeRotations) {
          if (nodeEntity.id !== track.targetId) continue;

          nodeRotation.x = targetObject.quaternion.x;
          nodeRotation.y = targetObject.quaternion.y;
          nodeRotation.z = targetObject.quaternion.z;
          nodeRotation.w = targetObject.quaternion.w;
        }
        break;
      }

      case KeyframePath.SCALE: {
        for (const [nodeEntity, nodeScale] of nodeScales) {
          if (nodeEntity.id !== track.targetId) continue;

          nodeScale.x = targetObject.scale.x;
          nodeScale.y = targetObject.scale.y;
          nodeScale.z = targetObject.scale.z;
        }
        break;
      }

      case KeyframePath.WEIGHTS: {
        break;
      }
    }
  }
}
