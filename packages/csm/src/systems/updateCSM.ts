import { Res } from "thyseus";

import { CSMStore } from "../resources";

export function updateCSM(csmStore: Res<CSMStore>) {
  for (const [, csm] of csmStore.objects) {
    csm.update();
  }
}
