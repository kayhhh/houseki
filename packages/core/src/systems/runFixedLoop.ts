import { Mut, Res, struct, SystemRes, World } from "thyseus";

import { Time } from "../resources";
import { LatticeSchedules } from "../schedules";

const FIXED_HZ = 60;
const FIXED_STEP_MS = 1000 / FIXED_HZ;

@struct
class LocalRes {
  @struct.f32 declare timeSinceLastFixedUpdate: number;
}

export async function runFixedLoop(
  world: World,
  time: Res<Mut<Time>>,
  localRes: SystemRes<LocalRes>,
) {
  const now = performance.now();
  const delta = now - time.fixedTime;
  localRes.timeSinceLastFixedUpdate += delta;

  while (localRes.timeSinceLastFixedUpdate >= FIXED_STEP_MS) {
    time.fixedTime = now;
    time.fixedDelta = FIXED_STEP_MS / 1000;

    await runSchedule(world, LatticeSchedules.PreFixedUpdate);
    await runSchedule(world, LatticeSchedules.FixedUpdate);
    await runSchedule(world, LatticeSchedules.PostFixedUpdate);

    localRes.timeSinceLastFixedUpdate -= FIXED_STEP_MS;
  }
}

function runSchedule(world: World, schedule: symbol) {
  if (world.schedules[schedule]) {
    return world.runSchedule(schedule);
  }
}
