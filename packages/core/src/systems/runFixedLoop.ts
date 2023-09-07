import { type f32, Mut, Res, struct, SystemRes, World } from "thyseus";

import { Time } from "../resources";
import { ReddoSchedules } from "../schedules";

const FIXED_HZ = 60;
const FIXED_STEP_MS = 1000 / FIXED_HZ;

@struct
class LocalRes {
  timeSinceLastFixedUpdate: f32 = 0;
}

export async function runFixedLoop(
  world: World,
  time: Res<Mut<Time>>,
  localRes: SystemRes<LocalRes>
) {
  const now = performance.now();
  const delta = now - time.fixedTime;
  localRes.timeSinceLastFixedUpdate += delta;

  let nextFixedTime = now;

  while (localRes.timeSinceLastFixedUpdate >= FIXED_STEP_MS) {
    time.fixedTime = nextFixedTime;
    time.fixedDelta = FIXED_STEP_MS / 1000;

    // @ts-expect-error
    time.serialize();

    await runSchedule(world, ReddoSchedules.PreFixedUpdate);
    await runSchedule(world, ReddoSchedules.FixedUpdate);
    await runSchedule(world, ReddoSchedules.PostFixedUpdate);

    localRes.timeSinceLastFixedUpdate -= FIXED_STEP_MS;
    nextFixedTime += FIXED_STEP_MS;
  }
}

function runSchedule(world: World, schedule: symbol) {
  if (world.schedules[schedule]) {
    return world.runSchedule(schedule);
  }
}
