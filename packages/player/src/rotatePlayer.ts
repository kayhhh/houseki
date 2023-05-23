import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Rotation } from "@lattice-engine/scene";
import { Euler, Quaternion } from "three";
import { EventReader, Mut, Query, Res } from "thyseus";

import { PlayerControls } from "./components";
import { PlayerControlsView } from "./types";

const minPolarAngle = 0;
const maxPolarAngle = Math.PI;

const euler = new Euler(0, 0, 0, "YXZ");
const quaternion = new Quaternion();

/**
 * Rotates the camera based on mouse movement.
 */
export function rotatePlayer(
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  entities: Query<[PlayerControls, Mut<Rotation>]>
) {
  // TODO: Support non pointer lock controls.
  if (!inputStruct.isPointerLocked) return;

  // Update rotation on pointer move
  for (const event of pointerMoveReader) {
    for (const [player, rotation] of entities) {
      if (player.currentView === PlayerControlsView.FirstPerson) {
        rotateFirstPerson(event, rotation);
      } else if (player.currentView === PlayerControlsView.ThirdPerson) {
        rotateThirdPerson(event, rotation);
      }
    }
  }
}

/**
 * Rotate the camera in first person mode.
 */
function rotateFirstPerson(event: PointerMoveEvent, rotation: Rotation) {
  euler.setFromQuaternion(
    quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
  );

  euler.y -= event.movementX * 0.002;
  euler.x -= event.movementY * 0.002;

  euler.x = Math.max(
    Math.PI / 2 - maxPolarAngle,
    Math.min(Math.PI / 2 - minPolarAngle, euler.x)
  );

  quaternion.setFromEuler(euler);

  rotation.x = quaternion.x;
  rotation.y = quaternion.y;
  rotation.z = quaternion.z;
  rotation.w = quaternion.w;
}

/**
 * Rotates the camera in third person mode, around the player.
 */
function rotateThirdPerson(event: PointerMoveEvent, rotation: Rotation) {}
