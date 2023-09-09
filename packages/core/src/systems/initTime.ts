import { Mut, Res } from "thyseus";

import { Time } from "../resources";

export function initTime(time: Res<Mut<Time>>) {
  const now = performance.now();

  time.fixedTime = now;
  time.mainTime = now;

  time.fixedDelta = 0;
  time.mainDelta = 0;
}
