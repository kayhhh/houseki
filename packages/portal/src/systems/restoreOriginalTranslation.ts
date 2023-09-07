import { TargetTranslation } from "@houseki-engine/player";
import { Transform } from "@houseki-engine/scene";
import { Mut, Query } from "thyseus";

import { OriginalTransform, OriginalTranslation } from "../components";

export function restoreOriginalTranslation(
  entities: Query<
    [
      Mut<TargetTranslation>,
      Mut<Transform>,
      OriginalTranslation,
      OriginalTransform
    ]
  >
) {
  for (const [target, transform, ogTarget, ogTransform] of entities) {
    target.copy(ogTarget);
    transform.translation.copy(ogTransform.translation);
  }
}
