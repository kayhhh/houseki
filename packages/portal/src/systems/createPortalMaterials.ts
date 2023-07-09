import { RenderStore } from "@lattice-engine/render";
import { WebGLRenderTarget } from "three";
import { Entity, Mut, Query, Res } from "thyseus";

import { PortalMaterial } from "../components";
import { PortalStore } from "../resources";

export function createPortalMaterials(
  renderStore: Res<Mut<RenderStore>>,
  portalStore: Res<Mut<PortalStore>>,
  portals: Query<[Entity, PortalMaterial]>,
) {
  const ids: bigint[] = [];

  for (const [entity, portal] of portals) {
    ids.push(entity.id);

    const object = renderStore.basicMaterials.get(entity.id);
    let renderTarget = portalStore.renderTargets.get(entity.id);

    if (!renderTarget) {
      renderTarget = new WebGLRenderTarget(
        portal.renderWidth,
        portal.renderHeight,
      );
      portalStore.renderTargets.set(entity.id, renderTarget);
    }

    renderTarget.setSize(portal.renderWidth, portal.renderHeight);

    if (object && object.map !== renderTarget.texture) {
      object.map = renderTarget.texture;
      object.needsUpdate = true;
    }
  }

  // Remove old portal materials
  for (const id of portalStore.renderTargets.keys()) {
    if (!ids.includes(id)) {
      const renderTarget = portalStore.renderTargets.get(id);
      renderTarget?.dispose();

      const material = renderStore.basicMaterials.get(id);
      material?.dispose();

      renderStore.basicMaterials.delete(id);
      portalStore.renderTargets.delete(id);
    }
  }
}
