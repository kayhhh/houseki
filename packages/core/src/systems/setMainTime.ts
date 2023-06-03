import { Mut, Res } from "thyseus";

import { Time } from "../resources";

export function setMainTime(time: Res<Mut<Time>>) {
  const now = performance.now();
  time.mainDelta = (now - time.mainTime) / 1000;
  time.mainTime = now;
}
