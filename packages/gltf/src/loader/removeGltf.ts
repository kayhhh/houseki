import { Node, Parent, Position, Rotation, Scale } from "@lattice-engine/scene";
import { Commands } from "thyseus";

import { LoadingContext } from "./context";

export function removeGltf(context: LoadingContext, commands: Commands) {
  for (const id of context.nodes) {
    // Despawning entities is causing issues right now
    // This is a workaround that just removes objects from the scene, not the ECS
    // TODO: fix this
    // commands.despawn(id);
    commands.removeFrom(id, Node);
    commands.removeFrom(id, Parent);
    commands.removeFrom(id, Position);
    commands.removeFrom(id, Rotation);
    commands.removeFrom(id, Scale);
  }

  for (const id of context.meshes) {
    // commands.despawn(id);
  }

  for (const id of context.materials) {
    // commands.despawn(id);
  }
}
