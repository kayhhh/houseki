import { Time } from "@lattice-engine/core";
import { RenderStore } from "@lattice-engine/render";
import { Entity, Query, Res } from "thyseus";

import { Vrm } from "../components";
import { FIRSTPERSON_ONLY_LAYER, THIRDPERSON_ONLY_LAYER } from "../constants";
import { VrmStore } from "../resources";

export function updateAvatars(
  time: Res<Time>,
  vrmStore: Res<VrmStore>,
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, Vrm]>,
) {
  for (const [entity, vrm] of entities) {
    const object = vrmStore.avatars.get(entity.id);
    if (!object) continue;

    // Update VRM
    object.update(time.mainDelta);

    // Add to scene
    const node = renderStore.nodes.get(entity.id);
    if (node) {
      node.add(object.scene);
    }

    // Setup first person layers
    if (vrm.setupFirstPerson && object.firstPerson) {
      object.firstPerson.setup({
        firstPersonOnlyLayer: FIRSTPERSON_ONLY_LAYER,
        thirdPersonOnlyLayer: THIRDPERSON_ONLY_LAYER,
      });
    }
  }
}
