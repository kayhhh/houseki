import { initStruct, Mut, Res, struct, SystemRes } from "thyseus";

import { MainLoopTime } from "../resources";

@struct
export class LocalStore {
  @struct.f32 declare lastTime: number;

  constructor() {
    initStruct(this);

    this.lastTime = performance.now();
  }
}

export function mainLoopDelta(
  localStore: SystemRes<LocalStore>,
  mainLoopTime: Res<Mut<MainLoopTime>>
) {
  const time = performance.now();
  mainLoopTime.delta = (time - localStore.lastTime) / 1000;
  localStore.lastTime = time;
}
