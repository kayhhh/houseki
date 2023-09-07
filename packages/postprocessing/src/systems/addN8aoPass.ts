import { RenderStore } from "@houseki-engine/render";
import { EffectComposer } from "postprocessing";
import { Res, SystemRes } from "thyseus";

import { N8aoRes } from "../resources";

class LocalStore {
  composer: EffectComposer | null = null;
}

export function addN8aoPass(
  renderStore: Res<RenderStore>,
  res: Res<N8aoRes>,
  localStore: SystemRes<LocalStore>
) {
  if (renderStore.composer !== localStore.composer) {
    if (!res.pass) return;

    // We want to add the pass immediately after the render pass
    // before other post-processing effects, like anti-aliasing.
    const renderIndex = renderStore.composer.passes.findIndex(
      (pass) => pass.name === "RenderPass"
    );
    if (renderIndex === -1) return;

    renderStore.composer.addPass(res.pass as any, renderIndex + 1);
    localStore.composer = renderStore.composer;
  }
}
