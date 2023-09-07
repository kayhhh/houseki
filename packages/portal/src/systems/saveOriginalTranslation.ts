import { TargetTranslation } from "@houseki-engine/player";
import { Transform } from "@houseki-engine/scene";
import { Mut, Query } from "thyseus";

import { OriginalTransform, OriginalTranslation } from "../components";

export function saveOriginalTranslation(
  entities: Query<
    [
      TargetTranslation,
      Transform,
      Mut<OriginalTranslation>,
      Mut<OriginalTransform>
    ]
  >
) {
  for (const [target, transform, ogTarget, ogTransform] of entities) {
    ogTarget.copy(target);
    ogTransform.copy(transform);
  }
}
