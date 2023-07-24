import { Time } from "@lattice-engine/core";
import { Res } from "thyseus";

import { PhysicsStore } from "../resources";

export function stepWorld(time: Res<Time>, store: Res<PhysicsStore>) {
  store.world.timestep = time.fixedDelta;
  store.world.step();
}
