import { Query } from "thyseus";

import { Transform } from "../components";

export function cleanTransforms(transforms: Query<Transform>) {
  for (const transform of transforms) {
    transform.translation.hasChanged = false;
    transform.rotation.hasChanged = false;
    transform.scale.hasChanged = false;
  }
}
