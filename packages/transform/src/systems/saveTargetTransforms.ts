import { TargetTransform } from "@reddo/physics";
import { Transform } from "@reddo/scene";
import { Entity, Mut, Query } from "thyseus";

import { TransformControls } from "../components";

export function saveTargetTransforms(
  transformControls: Query<TransformControls>,
  nodes: Query<[Entity, Transform, Mut<TargetTransform>]>
) {
  for (const controls of transformControls) {
    for (const [nodeEnt, transform, targetTransform] of nodes) {
      if (controls.targetId !== nodeEnt.id) continue;

      targetTransform.copy(transform);
    }
  }
}
