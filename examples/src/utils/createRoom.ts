import { Warehouse } from "reddo/core";
import { BoxCollider, StaticBody } from "reddo/physics";
import { GlobalTransform, Mesh, Parent, Transform } from "reddo/scene";
import { Commands } from "thyseus";

import { createBoxGeometry } from "./geometry";
import { Vec3 } from "./types";

const THICKNESS = 0.5;

/**
 * Creates a ground and four walls
 * @param size The size of the room
 * @param commands The Thyseus commands object
 */
export function createRoom(
  warehouse: Warehouse,
  size: Vec3,
  commands: Commands
) {
  // Create ground
  const groundId = createBox(
    warehouse,
    [size[0], THICKNESS, size[2]],
    [0, -THICKNESS / 2, 0],
    commands
  );

  // Create walls
  const x = size[0] / 2 - THICKNESS / 2;
  const y = size[1] / 2 - THICKNESS / 2;
  const z = size[2] / 2 - THICKNESS / 2;

  createBox(
    warehouse,
    [THICKNESS, size[1], size[2]],
    [-x, y, 0],
    commands,
    groundId
  );
  createBox(
    warehouse,
    [THICKNESS, size[1], size[2]],
    [x, y, 0],
    commands,
    groundId
  );
  createBox(
    warehouse,
    [size[0], size[1], THICKNESS],
    [0, y, -z],
    commands,
    groundId
  );
  createBox(
    warehouse,
    [size[0], size[1], THICKNESS],
    [0, y, z],
    commands,
    groundId
  );

  return groundId;
}

/**
 * Creates a box with a mesh, collider, and static body
 */
function createBox(
  warehouse: Warehouse,
  size: Vec3,
  translation: Vec3,
  commands: Commands,
  parentId?: bigint
) {
  const geometry = createBoxGeometry(warehouse, size);

  const transform = new Transform(translation);
  const collider = new BoxCollider(size);

  const entity = commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .addType(Mesh)
    .add(geometry)
    .add(collider)
    .addType(StaticBody);

  if (parentId) {
    const parent = new Parent(parentId);
    entity.add(parent);
  }

  return entity.id;
}
