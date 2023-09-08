import { type f32, Mut, Res, struct, World } from "thyseus";

import { Time } from "../resources";
import { HousekiSchedules } from "../schedules";

const FIXED_HZ = 60;
const FIXED_STEP_MS = 1000 / FIXED_HZ;

@struct
export class FixedLoopData {
  lastLoop: f32 = 0;
  lastUpdate: f32 = 0;
}

export async function runFixedLoop(
  world: World,
  time: Res<Mut<Time>>,
  data: Res<Mut<FixedLoopData>>
) {
  const now = performance.now();
  const delta = now - data.lastLoop;
  data.lastLoop = now;

  data.lastUpdate += delta;
  data.lastUpdate = Math.min(data.lastUpdate, 5000);

  time.fixedDelta = FIXED_STEP_MS / 1000;

  while (data.lastUpdate >= FIXED_STEP_MS) {
    time.fixedTime = now - data.lastUpdate;

    // @ts-expect-error
    time.serialize();

    await runSchedule(world, HousekiSchedules.PreFixedUpdate);
    await runSchedule(world, HousekiSchedules.FixedUpdate);
    await runSchedule(world, HousekiSchedules.PostFixedUpdate);

    data.lastUpdate -= FIXED_STEP_MS;
  }
}

function runSchedule(world: World, schedule: symbol) {
  if (world.schedules[schedule]) {
    return world.runSchedule(schedule);
  }
}
