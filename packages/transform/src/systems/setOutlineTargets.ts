import { OutlineTarget } from "@lattice-engine/postprocessing";
import { Commands, Query, SystemRes } from "thyseus";

import { TransformControls } from "../components";

class LocalRes {
  outlineTargets = new Set<bigint>();
}

export function setOutlineTargets(
  commands: Commands,
  localRes: SystemRes<LocalRes>,
  transformControls: Query<TransformControls>,
) {
  const ids: bigint[] = [];

  for (const controls of transformControls) {
    if (!controls.outline) continue;

    ids.push(controls.targetId);
    localRes.outlineTargets.add(controls.targetId);
    commands.getById(controls.targetId).addType(OutlineTarget);
  }

  // Remove outline for old targets
  for (const id of localRes.outlineTargets) {
    if (!ids.includes(id)) {
      localRes.outlineTargets.delete(id);
      commands.getById(id).remove(OutlineTarget);
    }
  }
}
