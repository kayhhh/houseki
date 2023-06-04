import { RenderStore } from "@lattice-engine/render";
import { EffectComposer } from "postprocessing";
import { Res, SystemRes } from "thyseus";

import { N8AOStore } from "../resources";

class LocalStore {
  composer: EffectComposer | null = null;
}

export function addPass(
  renderStore: Res<RenderStore>,
  aoStore: Res<N8AOStore>,
  localStore: SystemRes<LocalStore>
) {
  if (renderStore.composer !== localStore.composer) {
    if (!aoStore.pass.camera || !aoStore.pass.scene) return;

    // We want to add the AO pass immediately after the render pass
    // before other post-processing effects, like anti-aliasing.
    const renderIndex = renderStore.composer.passes.findIndex(
      (pass) => pass.name === "RenderPass"
    );
    if (renderIndex === -1) return;

    renderStore.composer.addPass(aoStore.pass as any, renderIndex + 1);
    localStore.composer = renderStore.composer;
  }
}
