import { Position, Rotation } from "@lattice-engine/scene";
import { Entity, Query, With, Without } from "thyseus";

import { PlayerControls } from "./components";

/**
 * Adds position and rotation components to PlayerControl entities that don't have them.
 */
export function preparePlayer(
  withoutPosition: Query<Entity, [With<PlayerControls>, Without<Position>]>,
  withoutRotation: Query<Entity, [With<PlayerControls>, Without<Rotation>]>
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
