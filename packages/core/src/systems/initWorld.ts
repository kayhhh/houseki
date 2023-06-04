import { Commands } from "thyseus";

export function initWorld(commands: Commands) {
  // Spawn a dummy entity to take up the first ID
  // This is a workaround for the fact that the first ID is always 0
  // and we want to use 0 as a null value when storing entity IDs
  commands.spawn();
}
