import { TargetRotation } from "@houseki-engine/player";
import { Transform } from "@houseki-engine/scene";
import { Mut, Query } from "thyseus";

import { OriginalRotation, OriginalTransform } from "../components";

export function restoreOriginalRotation(
  entities: Query<
    [Mut<TargetRotation>, Mut<Transform>, OriginalRotation, OriginalTransform]
  >
) {
  for (const [target, transform, ogTarget, ogTransform] of entities) {
    target.copy(ogTarget);
    transform.rotation.copy(ogTransform.rotation);
  }
}
