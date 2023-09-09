import { Mut, Query } from "thyseus";

import { PrevTargetTransform, TargetTransform } from "../components";

export function savePrevTargetTransforms(
  transforms: Query<[Mut<PrevTargetTransform>, TargetTransform]>
) {
  for (const [prev, transform] of transforms) {
    prev.copy(transform);
  }
}
