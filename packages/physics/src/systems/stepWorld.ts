import { Res, ResourceDescriptor } from "thyseus";

import { PhysicsStore } from "../PhysicsStore";

export function stepWorld(store: Res<PhysicsStore>) {
  store.world.step();
}

stepWorld.parameters = [ResourceDescriptor(PhysicsStore)];
