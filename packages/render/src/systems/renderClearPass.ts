import { ClearPass } from "postprocessing";
import { Res } from "thyseus";

import { RenderStore } from "../resources";

const clearPass = new ClearPass(true, true, true);

export function renderClearPass(renderStore: Res<RenderStore>) {
  clearPass.render(
    renderStore.renderer,
    renderStore.composer.inputBuffer,
    renderStore.composer.outputBuffer,
  );
}
