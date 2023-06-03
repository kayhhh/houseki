import { Mut, Res } from "thyseus";

import { RenderStore } from "../resources";
import { disposeMaterial } from "../utils/dispose";

export function clearScene(renderStore: Res<Mut<RenderStore>>) {
  renderStore.renderer.dispose();

  renderStore.materials.forEach(disposeMaterial);
  renderStore.materials.clear();

  renderStore.geometries.forEach((geometry) => geometry.dispose());
  renderStore.geometries.clear();
}
