import { Warehouse } from "@lattice-engine/core";
import { BoxCollider, StaticBody } from "@lattice-engine/physics";
import { Mesh, Node, Parent, Position } from "@lattice-engine/scene";
import { Commands } from "thyseus";

import { createBoxGeometry } from "./createBoxGeometry";
import { Vec3 } from "./types";

const THICKNESS = 0.4;

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
  const ground = createBox(
    [size[0], THICKNESS, size[2]],
    [0, -THICKNESS / 2, 0],
    commands,
    warehouse
  );

  // Create walls
  const x = size[0] / 2 - THICKNESS / 2;
  const y = size[1] / 2 - THICKNESS / 2;
  const z = size[2] / 2 - THICKNESS / 2;

  const wall1 = createBox(
    [THICKNESS, size[1], size[2]],
    [-x, y, 0],
    commands,
    warehouse
  );
  const wall2 = createBox(
    [THICKNESS, size[1], size[2]],
    [x, y, 0],
    commands,
    warehouse
  );
  const wall3 = createBox(
    [size[0], size[1], THICKNESS],
    [0, y, -z],
    commands,
    warehouse
  );
  const wall4 = createBox(
    [size[0], size[1], THICKNESS],
    [0, y, z],
    commands,
    warehouse
  );

  wall1.add(new Parent(ground));
  wall2.add(new Parent(ground));
  wall3.add(new Parent(ground));
  wall4.add(new Parent(ground));

  return ground;
}

/**
 * Creates a box with a mesh, collider, and static body
 */
function createBox(
  size: Vec3,
  position: Vec3,
  commands: Commands,
  warehouse: Readonly<Warehouse>
) {
  const geometry = createBoxGeometry(warehouse, size);

  return commands
    .spawn()
    .addType(Node)
    .add(new Position(...position))
    .addType(Mesh)
    .add(geometry)
    .add(new BoxCollider(size))
    .addType(StaticBody);
}
