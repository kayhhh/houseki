import { Mut, Res } from "thyseus";

import { Time } from "../resources";

export function setFixedTime(time: Res<Mut<Time>>) {
  const now = performance.now();
  time.fixedDelta = (now - time.fixedTime) / 1000;
  time.fixedTime = now;
}
