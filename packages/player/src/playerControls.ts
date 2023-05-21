import { InputStruct, PointerMoveEvent } from "@lattice-engine/input";
import { Rotation } from "@lattice-engine/scene";
import {
  Entity,
  EventReader,
  EventReaderDescriptor,
  Mut,
  MutDescriptor,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
  With,
  WithDescriptor,
} from "thyseus";

import { PlayerControls } from "./components";

const minPolarAngle = 0;
const maxPolarAngle = Math.PI;

export function playerControls(
  inputStruct: Res<InputStruct>,
  pointerMoveReader: EventReader<PointerMoveEvent>,
  withoutRotation: Query<Entity, With<PlayerControls>>,
  withRotation: Query<Mut<Rotation>, With<PlayerControls>>
) {
  // TODO: Support non pointer lock controls.
  if (!inputStruct.enablePointerLock) return;

  // Add rotation component to entities that don't have it yet
  for (const entity of withoutRotation) {
    entity.addType(Rotation);
  }

  // Update rotation component for entities that have it
  for (const event of pointerMoveReader) {
    for (const rotation of withRotation) {
      const euler = quaternionToEuler(rotation);

      const y = euler[1] - event.movementX * 0.002;
      const x = euler[0] - event.movementY * 0.002;

      const clampedX = Math.max(
        Math.PI / 2 - maxPolarAngle,
        Math.min(Math.PI / 2 - minPolarAngle, x)
      );

      const newEuler: Vec3 = [clampedX, y, euler[2]];
      const newRotation = eulerToQuaternion(newEuler);

      rotation.x = newRotation.x;
      rotation.y = newRotation.y;
      rotation.z = newRotation.z;
      rotation.w = newRotation.w;
    }
  }
}

playerControls.parameters = [
  ResourceDescriptor(InputStruct),
  EventReaderDescriptor(PointerMoveEvent),
  QueryDescriptor(Entity, WithDescriptor(PlayerControls)),
  QueryDescriptor(MutDescriptor(Rotation), WithDescriptor(PlayerControls)),
];

type Vec3 = [number, number, number];

export function quaternionToEuler({ x, y, z, w }: Rotation): Vec3 {
  // Rotate Matrix4
  const te = [];

  const x2 = x + x,
    y2 = y + y,
    z2 = z + z;
  const xx = x * x2,
    xy = x * y2,
    xz = x * z2;
  const yy = y * y2,
    yz = y * z2,
    zz = z * z2;
  const wx = w * x2,
    wy = w * y2,
    wz = w * z2;

  const sx = 1;
  const sy = 1;
  const sz = 1;

  const px = 0;
  const py = 0;
  const pz = 0;

  te[0] = (1 - (yy + zz)) * sx;
  te[1] = (xy + wz) * sx;
  te[2] = (xz - wy) * sx;
  te[3] = 0;

  te[4] = (xy - wz) * sy;
  te[5] = (1 - (xx + zz)) * sy;
  te[6] = (yz + wx) * sy;
  te[7] = 0;

  te[8] = (xz + wy) * sz;
  te[9] = (yz - wx) * sz;
  te[10] = (1 - (xx + yy)) * sz;
  te[11] = 0;

  te[12] = px;
  te[13] = py;
  te[14] = pz;
  te[15] = 1;

  // To Euler
  const m11 = te[0];
  const m12 = te[4];
  const m13 = te[8];

  // const m21 = te[1];
  const m22 = te[5];
  const m23 = te[9];

  // const m31 = te[2];
  const m32 = te[6];
  const m33 = te[10];

  const eulerY = Math.asin(clamp(m13, -1, 1));

  let eulerX: number;
  let eulerZ: number;

  if (Math.abs(m13) < 0.9999999) {
    eulerX = Math.atan2(-m23, m33);
    eulerZ = Math.atan2(-m12, m11);
  } else {
    eulerX = Math.atan2(m32, m22);
    eulerZ = 0;
  }

  return [eulerX, eulerY, eulerZ];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function eulerToQuaternion([x, y, z]: Vec3): Rotation {
  const c1 = Math.cos(x / 2);
  const c2 = Math.cos(y / 2);
  const c3 = Math.cos(z / 2);

  const s1 = Math.sin(x / 2);
  const s2 = Math.sin(y / 2);
  const s3 = Math.sin(z / 2);

  const qx = s1 * c2 * c3 + c1 * s2 * s3;
  const qy = c1 * s2 * c3 - s1 * c2 * s3;
  const qz = c1 * c2 * s3 + s1 * s2 * c3;
  const qw = c1 * c2 * c3 - s1 * s2 * s3;

  return { w: qw, x: qx, y: qy, z: qz };
}
