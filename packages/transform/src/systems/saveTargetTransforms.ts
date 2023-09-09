import { PrevTargetTransform, TargetTransform } from "@houseki-engine/physics";
import { Transform } from "@houseki-engine/scene";
import { Entity, Mut, Query } from "thyseus";

import { TransformControls } from "../components";

export function saveTargetTransforms(
  transformControls: Query<TransformControls>,
  nodes: Query<
    [Entity, Transform, Mut<TargetTransform>, Mut<PrevTargetTransform>]
  >
) {
  for (const controls of transformControls) {
    for (const [nodeEnt, transform, target, prev] of nodes) {
      if (controls.targetId !== nodeEnt.id) continue;

      target.copy(transform);
      prev.copy(transform);
    }
  }
}
