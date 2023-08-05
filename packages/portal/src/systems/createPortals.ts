import { BoxCollider, StaticBody } from "@lattice-engine/physics";
import { BasicMaterial, Mesh } from "@lattice-engine/scene";
import { Commands, Entity, Query, Without } from "thyseus";

import { Portal, PortalMaterial } from "../components";
import { createPlaneGeometry } from "../utils/geometry";

const PORTAL_DEPTH = 0.01;

export function createPortals(
  commands: Commands,
  portals: Query<
    [Entity, Portal],
    [Without<BoxCollider>, Without<Mesh>, Without<BasicMaterial>]
  >
) {
  if (portals.length === 0) return;

  const collider = new BoxCollider();

  for (const [entity, portal] of portals) {
    collider.size.set(portal.width, portal.height, PORTAL_DEPTH);

    const geometry = createPlaneGeometry(portal.width, portal.height);

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
