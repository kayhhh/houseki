import { TargetRotation } from "@reddo/player";
import { Transform } from "@reddo/scene";
import { Mut, Query } from "thyseus";

import { OriginalRotation, OriginalTransform } from "../components";

export function saveOriginalRotation(
  entities: Query<
    [TargetRotation, Transform, Mut<OriginalRotation>, Mut<OriginalTransform>]
  >
) {
  for (const [target, transform, ogTarget, ogTransform] of entities) {
    ogTarget.copy(target);
    ogTransform.copy(transform);
  }
}
