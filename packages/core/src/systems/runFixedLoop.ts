import { type f32, Mut, Res, struct, SystemRes, World } from "thyseus";

import { Time } from "../resources";
import { HousekiSchedules } from "../schedules";

const FIXED_HZ = 60;
const FIXED_STEP_MS = 1000 / FIXED_HZ;

@struct
class LocalRes {
  lastLoop: f32 = 0;
  lastUpdate: f32 = 0;
}

export async function runFixedLoop(
  world: World,
  time: Res<Mut<Time>>,
  localRes: SystemRes<LocalRes>
) {
  const now = performance.now();
  const delta = now - localRes.lastLoop;
  localRes.lastLoop = now;

  localRes.lastUpdate += delta;
  localRes.lastUpdate = Math.min(localRes.lastUpdate, 5000);

  time.fixedDelta = FIXED_STEP_MS / 1000;

  while (localRes.lastUpdate >= FIXED_STEP_MS) {
    time.fixedTime = now - localRes.lastUpdate;

    // @ts-expect-error
    time.serialize();

    await runSchedule(world, HousekiSchedules.PreFixedUpdate);
    await runSchedule(world, HousekiSchedules.FixedUpdate);
    await runSchedule(world, HousekiSchedules.PostFixedUpdate);

    localRes.lastUpdate -= FIXED_STEP_MS;
  }
}

function runSchedule(world: World, schedule: symbol) {
  if (world.schedules[schedule]) {
    return world.runSchedule(schedule);
  }
}
