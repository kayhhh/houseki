import { RenderStore } from "@houseki-engine/render";
import { PerspectiveCamera, Transform } from "@houseki-engine/scene";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { OrbitControls } from "../components";
import { OrbitControlsStore } from "../resources";

export function saveTransforms(
  renderStore: Res<RenderStore>,
  store: Res<OrbitControlsStore>,
  entities: Query<
    [Entity, Mut<Transform>],
    With<[OrbitControls, PerspectiveCamera]>
  >
) {
  for (const [entity, transform] of entities) {
    const object = store.objects.get(entity.id);
    if (!object) continue;

    const cameraObject = renderStore.perspectiveCameras.get(entity.id);
    if (!cameraObject) continue;

    transform.translation.fromObject(cameraObject.position);
    transform.rotation.fromObject(cameraObject.quaternion);
  }
}
