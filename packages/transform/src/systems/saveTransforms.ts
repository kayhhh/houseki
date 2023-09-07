import { RenderStore } from "@reddo/render";
import { Transform } from "@reddo/scene";
import { Entity, Mut, Query, Res } from "thyseus";

import { TransformControls } from "../components";
import { TransformControlsStore } from "../resources";

export function saveTransforms(
  renderStore: Res<RenderStore>,
  store: Res<TransformControlsStore>,
  transformControls: Query<[Entity, TransformControls]>,
  nodes: Query<[Entity, Mut<Transform>]>
) {
  for (const [controlsEnt, controls] of transformControls) {
    const controlsObject = store.objects.get(controlsEnt.id);
    if (!controlsObject) continue;

    for (const [nodeEnt, transform] of nodes) {
      if (controls.targetId !== nodeEnt.id) continue;

      const targetObject = renderStore.nodes.get(nodeEnt.id);
      if (!targetObject) continue;

      transform.translation.fromArray(targetObject.position.toArray());
      transform.rotation.fromArray(
        targetObject.quaternion.toArray() as [number, number, number, number]
      );
      transform.scale.fromArray(targetObject.scale.toArray());
    }
  }
}
