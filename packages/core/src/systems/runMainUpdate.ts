import { type f32, Mut, Res, struct, World } from "thyseus";

import { Time } from "../resources";
import { HousekiSchedules } from "../schedules";

@struct
export class MainLoopData {
  lastLoop: f32 = 0;
}

export async function runMainUpdate(
  world: World,
  time: Res<Mut<Time>>,
  data: Res<Mut<MainLoopData>>
) {
  const now = performance.now();
  const delta = now - data.lastLoop;
  data.lastLoop = now;

  time.mainTime = now;
  time.mainDelta = delta / 1000;

  // @ts-expect-error
  time.serialize();

  await runSchedule(world, HousekiSchedules.PreUpdate);
  await runSchedule(world, HousekiSchedules.Update);
  await runSchedule(world, HousekiSchedules.PostUpdate);
}

function runSchedule(world: World, schedule: symbol) {
  if (world.schedules[schedule]) {
    return world.runSchedule(schedule);
  }
}
