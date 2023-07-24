import { TargetTransform } from "@lattice-engine/physics";
import { Transform } from "@lattice-engine/scene";
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
