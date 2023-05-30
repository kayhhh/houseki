import { Res } from "thyseus";

import { PhysicsStore } from "../resources";

export function stepWorld(store: Res<PhysicsStore>) {
  store.world.step();
}
