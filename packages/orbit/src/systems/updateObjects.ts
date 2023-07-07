import { Res } from "thyseus";

import { OrbitControlsStore } from "../resources";

export function updateObjects(store: Res<OrbitControlsStore>) {
  for (const object of store.objects.values()) {
    object.update();
  }
}
