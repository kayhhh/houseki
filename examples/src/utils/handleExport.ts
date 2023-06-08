import { CoreStore } from "lattice-engine/core";
import { ExportedGltf, Gltf } from "lattice-engine/gltf";
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
  Query,
  Res,
  With,
} from "thyseus";

import { createScene } from "./createScene";

export const exportConfig: { mode: "download" | "test" } = { mode: "download" };

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
      download(event);
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

function download(event: ExportedGltf) {
  const isBinary = event.binary;

  fetch(event.uri)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);

      const fileExtension = isBinary ? "glb" : "gltf";

      const link = document.createElement("a");
      link.download = `exported.${fileExtension}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    });
}
