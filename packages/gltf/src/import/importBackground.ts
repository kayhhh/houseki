import { Scene } from "@gltf-transform/core";
import { Warehouse } from "@houseki-engine/core";
import { Background as BackgroundComp } from "@houseki-engine/scene";
import { Commands } from "thyseus";

import { Background } from "../extensions/UNV_background/Background";
import { importTexture } from "./importTexture";

export function importBackground(
  warehouse: Warehouse,
  commands: Commands,
  scene: Scene,
  entityId: bigint
) {
  const ext = scene.getExtension<Background>(Background.EXTENSION_NAME);
  if (!ext) return;

  const texture = ext.getTexture();
  if (!texture) return;

  const imageId = importTexture(warehouse, texture, commands, true);
  if (!imageId) return;

  const background = new BackgroundComp();
  background.imageId = imageId;

  commands.getById(entityId).add(background);
}
