import { RenderStore } from "@lattice-engine/render";
import { SceneStruct } from "@lattice-engine/scene";
import { EffectComposer, EffectPass } from "postprocessing";
import { Res, SystemRes } from "thyseus";

import { OutlineRes } from "../resources";

type NotNull<T> = T extends null ? never : T;

class LocalRes {
  pass: EffectPass | null = null;
  composer: EffectComposer | null = null;
}

export function addEffectPass(
  renderStore: Res<RenderStore>,
  sceneStruct: Res<SceneStruct>,
  outlineRes: Res<OutlineRes>,
  localRes: SystemRes<LocalRes>,
) {
  const composerChanged = renderStore.composer !== localRes.composer;
  const effectsChanged = outlineRes.hasChanged;

  if (composerChanged || effectsChanged) {
    if (localRes.pass) {
      renderStore.composer.removePass(localRes.pass);
      localRes.pass.dispose();
    }

    const validEffects = [outlineRes.effect].filter(
      (effect): effect is NotNull<typeof effect> => effect !== null,
    );
    if (validEffects.length === 0) return;

    const cameraId = sceneStruct.activeCamera;
    if (cameraId === null) return;

    const camera = renderStore.perspectiveCameras.get(cameraId);
    if (!camera) return;

    // We want to add the pass immediately after the render pass
    // before other post-processing effects, like anti-aliasing.
    const renderIndex = renderStore.composer.passes.findIndex(
      (pass) => pass.name === "RenderPass",
    );
    if (renderIndex === -1) return;

    localRes.pass = new EffectPass(camera, ...validEffects);

    renderStore.composer.addPass(localRes.pass, renderIndex + 1);
    localRes.composer = renderStore.composer;
  }
}
