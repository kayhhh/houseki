import { Warehouse } from "@lattice-engine/core";
import { BoxCollider, StaticBody } from "@lattice-engine/physics";
import { BasicMaterial, Mesh } from "@lattice-engine/scene";
import {
  Commands,
  dropStruct,
  Entity,
  Mut,
  Query,
  Res,
  Without,
} from "thyseus";

import { Portal, PortalMaterial } from "../components";
import { createPlaneGeometry } from "../utils/geometry";

const PORTAL_DEPTH = 0.01;

export function createPortals(
  commands: Commands,
  warehouse: Res<Mut<Warehouse>>,
  portals: Query<
    [Entity, Portal],
    [Without<BoxCollider>, Without<Mesh>, Without<BasicMaterial>]
  >
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

    commands
      .get(entity)
      .add(collider)
      .addType(StaticBody)
      .add(geometry)
      .addType(Mesh)
      .add(basic)
      .addType(PortalMaterial);

    dropStruct(basic);
    dropStruct(geometry);
  }

  dropStruct(collider);
}
