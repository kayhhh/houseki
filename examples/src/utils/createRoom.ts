import { Warehouse } from "lattice-engine/core";
import { BoxCollider, StaticBody } from "lattice-engine/physics";
import { GlobalTransform, Mesh, Parent, Transform } from "lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

import { createBoxGeometry } from "./geometry";
import { Vec3 } from "./types";

const THICKNESS = 0.5;

/**
 * Creates a ground and four walls
 * @param size The size of the room
 * @param commands The Thyseus commands object
 * @param warehouse The Lattice warehouse object
 */
export function createRoom(
  size: Vec3,
  commands: Commands,
  warehouse: Readonly<Warehouse>
) {
  // Create ground
  const groundId = createBox(
    [size[0], THICKNESS, size[2]],
    [0, -THICKNESS / 2, 0],
    commands,
    warehouse
  );

  // Create walls
  const x = size[0] / 2 - THICKNESS / 2;
  const y = size[1] / 2 - THICKNESS / 2;
  const z = size[2] / 2 - THICKNESS / 2;

  createBox(
    [THICKNESS, size[1], size[2]],
    [-x, y, 0],
    commands,
    warehouse,
    groundId
  );

  createBox(
    [THICKNESS, size[1], size[2]],
    [x, y, 0],
    commands,
    warehouse,
    groundId
  );

  createBox(
    [size[0], size[1], THICKNESS],
    [0, y, -z],
    commands,
    warehouse,
    groundId
  );

  createBox(
    [size[0], size[1], THICKNESS],
    [0, y, z],
    commands,
    warehouse,
    groundId
  );

  return groundId;
}

/**
 * Creates a box with a mesh, collider, and static body
 */
function createBox(
  size: Vec3,
  translation: Vec3,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  parentId?: bigint
) {
  const geometry = createBoxGeometry(warehouse, size);

  const transform = new Transform(translation);
  const collider = new BoxCollider(size);

  const entity = commands
    .spawn()
    .add(transform)
    .addType(GlobalTransform)
    .addType(Mesh)
    .add(geometry)
    .add(collider)
    .addType(StaticBody);

  dropStruct(transform);
  dropStruct(collider);

  if (parentId) {
    const parent = new Parent(parentId);
    entity.add(parent);
    dropStruct(parent);
  }

  return entity.id;
}
