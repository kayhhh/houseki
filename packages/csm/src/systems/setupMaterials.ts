import { RenderStore } from "@lattice-engine/render";
import { Res } from "thyseus";

import { CSMStore } from "../resources";

export function setupMaterials(
  csmStore: Res<CSMStore>,
  renderStore: Res<RenderStore>
) {
  csmStore.objects.forEach((csm) => {
    renderStore.standardMaterials.forEach((material) => {
      csm.setupMaterial(material);
    });
  });
}
