import { Mut, Query } from "thyseus";

import { TargetTransform } from "../components";

export function saveTargetTransforms(transforms: Query<Mut<TargetTransform>>) {
  for (const transform of transforms) {
    transform.prev.copy(transform);
  }
}
