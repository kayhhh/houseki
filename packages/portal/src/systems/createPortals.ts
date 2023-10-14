import { Warehouse } from "@houseki-engine/core";
import { BoxCollider, StaticBody } from "@houseki-engine/physics";
import { BasicMaterial, Mesh } from "@houseki-engine/scene";
import { Commands, Entity, Mut, Query, Res, Without } from "thyseus";

import { Portal, PortalMaterial } from "../components";
import { createPlaneGeometry } from "../utils/geometry";

const PORTAL_DEPTH = 0.01;

export function createPortals(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  portals: Query<[Entity, Portal], Without<BoxCollider, Mesh, BasicMaterial>>
) {
  if (portals.length === 0) return;

  const collider = new BoxCollider();

  for (const [entity, portal] of portals) {
    collider.size.set(portal.width, portal.height, PORTAL_DEPTH);

    const geometry = createPlaneGeometry(
      warehouse,
      portal.width,
      portal.height
    );

    const basic = new BasicMaterial();
    basic.colorWrite = false;

    commands
      .get(entity)
      .add(collider)
      .addType(StaticBody)
      .add(geometry)
      .addType(Mesh)
      .add(basic)
      .addType(PortalMaterial);
  }
}
