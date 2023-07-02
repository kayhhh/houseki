import {
  ExportedGltf,
  ExportedJSON,
  ExportGltf,
  Gltf,
} from "lattice-engine/gltf";
import { DeepRemove, Scene } from "lattice-engine/scene";
import {
  Commands,
  dropStruct,
  Entity,
  EventReader,
  EventWriter,
  Query,
  With,
} from "thyseus";

import { selectedModel } from "../demos/gltf/systems";

export const exportConfig: {
  mode: "download" | "test" | "log";
  format: "binary" | "json";
} = {
  format: "binary",
  mode: "download",
};

export const ExportSchedule = Symbol("Export");

export function sendExportEvent(
  writer: EventWriter<ExportGltf>,
  scenes: Query<[Entity], With<Scene>>
) {
  for (const [entity] of scenes) {
    const event = writer.create();
    event.scene = entity.id;
    event.binary = exportConfig.format === "binary";
  }
}

export function handleExport(
  commands: Commands,
  reader: EventReader<ExportedGltf>,
  scenes: Query<Scene>,
  deepRemove: EventWriter<DeepRemove>
) {
  if (reader.length === 0) return;

  for (const event of reader) {
    if (exportConfig.mode === "download") {
      if (event.binary) {
        fetch(event.uri)
          .then((response) => response.blob())
          .then((blob) => downloadFile(blob, "scene.glb"));
      } else {
        fetch(event.uri)
          .then((response) => response.text())
          .then((text) => {
            const json = JSON.parse(text) as ExportedJSON;

            const gltfBlob = new Blob([JSON.stringify(json.json)], {
              type: "model/gltf+json",
            });

            downloadFile(gltfBlob, "scene.gltf");

            Object.entries(json.resources).forEach(([name, data]) => {
              const array = new Uint8Array(data);
              const blob = new Blob([array], {
                type: "application/octet-stream",
              });
              downloadFile(blob, name);
            });
          });
      }
    } else if (exportConfig.mode === "test") {
      let rootId = 0n;

      // Clear scene
      for (const scene of scenes) {
        const remove = deepRemove.create();
        remove.rootId = scene.rootId;

        rootId = scene.rootId;
      }

      // Prevent gltf demo from resetting the uri
      selectedModel.uri = event.uri;

      const gltf = new Gltf(event.uri);
      commands.getById(rootId).add(gltf);
      dropStruct(gltf);
    }
  }

  reader.clear();
}

function downloadFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
