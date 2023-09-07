import { Time } from "@reddo/core";
import { CharacterController } from "@reddo/physics";
import { Mut, Query, Res } from "thyseus";

import { PlayerBody } from "../components";

export function setAirTime(
  time: Res<Time>,
  entities: Query<[Mut<PlayerBody>, CharacterController]>
) {
  for (const [player, controller] of entities) {
    if (controller.isGrounded) {
      player.airTime = 0;
    } else {
      player.airTime += time.fixedDelta;
    }
  }
}
