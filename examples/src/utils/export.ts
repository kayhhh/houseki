import { ExportedGltf, ExportedJSON, ExportGltf, Gltf } from "houseki/gltf";
import { DeepRemove, RenderView, SceneView } from "houseki/scene";
import {
  Commands,
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
  views: Query<Entity, [With<RenderView>, With<SceneView>]>
) {
  for (const entity of views) {
    const event = new ExportGltf();
    event.binary = exportConfig.format === "binary";
    event.scene = entity.id;
    writer.create(event);
  }
}

export function handleExport(
  commands: Commands,
  reader: EventReader<ExportedGltf>,
  views: Query<[Entity, SceneView], With<RenderView>>,
  deepRemove: EventWriter<DeepRemove>
) {
  if (reader.length === 0) return;

  for (const event of reader) {
    const uri = event.uri;

    if (exportConfig.mode === "download") {
      if (event.binary) {
        fetch(uri)
          .then((response) => response.blob())
          .then((blob) => downloadFile(blob, "scene.glb"));
      } else {
        fetch(uri)
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

      for (const [entity, view] of views) {
        rootId = entity.id;

        for (const entityId of view.scenes) {
          // Clear scene
          const deepRemoveEvent = new DeepRemove();
          deepRemoveEvent.rootId = entityId;
          deepRemove.create(deepRemoveEvent);
        }
      }

      // Prevent gltf demo from resetting the uri
      selectedModel.uri = uri;

      const gltf = new Gltf();
      gltf.uri = uri;

      commands.getById(rootId).add(gltf);
    }
  }

  if (reader.length > 0) {
    reader.clear();
  }
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
