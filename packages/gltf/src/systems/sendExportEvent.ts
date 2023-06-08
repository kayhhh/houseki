import { Scene } from "@lattice-engine/scene";
import { Entity, EventWriter, Query, With } from "thyseus";

import { ExportGltf } from "../events";

export function sendExportEvent(
  writer: EventWriter<ExportGltf>,
  scenes: Query<[Entity], With<Scene>>
) {
  for (const [entity] of scenes) {
    const event = writer.create();
    event.scene = entity.id;
  }
}
