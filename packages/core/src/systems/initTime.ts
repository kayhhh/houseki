import { Mut, Res } from "thyseus";

import { Time } from "../resources";

export function initTime(time: Res<Mut<Time>>) {
  time.fixedTime = performance.now();
  time.fixedDelta = 0;
  time.mainTime = performance.now();
  time.mainDelta = 0;
}
