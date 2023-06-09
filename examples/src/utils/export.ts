import { JSONDocument } from "@gltf-transform/core";
import { CoreStore } from "lattice-engine/core";
import { ExportedGltf, ExportGltf, Gltf } from "lattice-engine/gltf";
import {
  GlobalTransform,
  Parent,
  Scene,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import {
  Commands,
  dropStruct,
  Entity,
  EventReader,
  EventWriter,
  Query,
  Res,
  With,
} from "thyseus";

import { createScene } from "./createScene";
import { exportConfig } from "./useEngine";

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
  coreStore: Res<CoreStore>,
  sceneStruct: Res<SceneStruct>,
  reader: EventReader<ExportedGltf>,
  scenes: Query<Entity, With<Scene>>
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
            const json: {
              json: JSONDocument["json"];
              resources: Record<string, number[]>;
            } = JSON.parse(text);

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
    } else {
      // Clear the scene
      for (const entity of scenes) {
        entity.despawn();
      }

      // Load the exported scene
      const scene = createScene(commands, coreStore, sceneStruct);

      const gltf = new Gltf(event.uri);
      const parent = new Parent(scene);

      commands
        .spawn()
        .add(gltf)
        .add(parent)
        .addType(Transform)
        .addType(GlobalTransform);

      dropStruct(gltf);
      dropStruct(parent);
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
