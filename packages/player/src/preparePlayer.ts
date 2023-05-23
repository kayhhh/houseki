import { Position, Rotation } from "@lattice-engine/scene";
import { Entity, Query, With, Without } from "thyseus";

import { PlayerBody } from "./components";

/**
 * Adds components to PlayerControl entities that are required for the player to work.
 */
export function preparePlayer(
  withoutPosition: Query<Entity, [With<PlayerBody>, Without<Position>]>,
  withoutRotation: Query<Entity, [With<PlayerBody>, Without<Rotation>]>
) {
  // Add position component
  for (const entity of withoutPosition) {
    entity.addType(Position);
  }

  // Add rotation component
  for (const entity of withoutRotation) {
    entity.addType(Rotation);
  }
}
