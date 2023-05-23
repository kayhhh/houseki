import { InputStruct, Key } from "@lattice-engine/input";
import { CharacterController, Velocity } from "@lattice-engine/physics";
import { Position, Rotation } from "@lattice-engine/scene";
import { Matrix4, Quaternion, Vector2, Vector3 } from "three";
import { Mut, Query, Res } from "thyseus";

import { PlayerControls } from "./components";
import { PlayerControlsView } from "./types";

const quaternion = new Quaternion();
const matrix4 = new Matrix4();
const vector3 = new Vector3();
const vector2 = new Vector2();

export function movePlayer(
  inputStruct: Res<InputStruct>,
  entities: Query<
    [
      PlayerControls,
      CharacterController,
      Mut<Position>,
      Rotation,
      Mut<Velocity>
    ]
  >
) {
  const input = readInput(inputStruct);

  for (const [player, character, position, rotation, velocity] of entities) {
    if (player.currentView === PlayerControlsView.FirstPerson) {
      moveFirstPerson(player, character, position, rotation, velocity, input);
    } else if (player.currentView === PlayerControlsView.ThirdPerson) {
      moveThirdPerson(player, character, position, rotation, velocity, input);
    }
  }
}

type Input = {
  jump: boolean;
  x: number;
  y: number;
};

/**
 * Reads and normalizes input.
 */
function readInput(inputStruct: InputStruct): Input {
  const up =
    inputStruct.keyPressed(Key.w) || inputStruct.keyPressed(Key.ArrowUp);
  const down =
    inputStruct.keyPressed(Key.s) || inputStruct.keyPressed(Key.ArrowDown);
  const left =
    inputStruct.keyPressed(Key.a) || inputStruct.keyPressed(Key.ArrowLeft);
  const right =
    inputStruct.keyPressed(Key.d) || inputStruct.keyPressed(Key.ArrowRight);
  const jump = inputStruct.keyPressed(Key.Space);

  const inputForward = Number(up) - Number(down);
  const inputRight = Number(right) - Number(left);

  const input = vector2
    .set(inputRight, inputForward)
    .multiplyScalar(2)
    .normalize();

  return { jump, x: input.x, y: input.y };
}

/**
 * Move the player in first person mode.
 */
function moveFirstPerson(
  player: PlayerControls,
  character: CharacterController,
  position: Position,
  rotation: Rotation,
  velocity: Velocity,
  input: Input
) {
  // Get direction vector
  quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  matrix4.setPosition(position.x, position.y, position.z);
  matrix4.makeRotationFromQuaternion(quaternion);
  vector3.setFromMatrixColumn(matrix4, 0);

  // Apply input to velocity
  velocity.x = vector3.x * input.x + vector3.z * input.y;
  velocity.z = vector3.z * input.x - vector3.x * input.y;

  // Apply speed
  velocity.x *= player.speed;
  velocity.z *= player.speed;

  // Teleport out of void
  if (player.enableVoidTeleport && position.y < player.voidLevel) {
    velocity.set(0, 0, 0);
    position.set(...player.spawnPoint.array());
  }

  if (input.jump && character.isGrounded) {
    velocity.y = player.jumpStrength;
  }
}

/**
 * Move the player in third person mode.
 */
function moveThirdPerson(
  player: PlayerControls,
  character: CharacterController,
  position: Position,
  rotation: Rotation,
  velocity: Velocity,
  input: Input
) {}
