import { Time } from "@lattice-engine/core";
import { Transform } from "@lattice-engine/scene";
import { lerp } from "three/src/math/MathUtils";
import { Mut, Query, Res } from "thyseus";

import { TargetTranslation } from "../components";

const LERP_STRENGTH = 0.05;

export function lerpTargetTranslation(
  time: Res<Time>,
  entities: Query<[Mut<Transform>, TargetTranslation]>
) {
  const K = 1 - LERP_STRENGTH ** (time.mainDelta * 100);

  for (const [transform, target] of entities) {
    transform.translation.x = lerp(transform.translation.x, target.x, K);
    transform.translation.y = lerp(transform.translation.y, target.y, K);
    transform.translation.z = lerp(transform.translation.z, target.z, K);
  }
}
