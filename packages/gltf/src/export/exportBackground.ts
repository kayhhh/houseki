import { Background } from "@houseki-engine/scene";

import { UNVBackground } from "../extensions/UNV_background/UNVBackground";
import { ExportContext } from "./context";

export function exportBackground(
  context: ExportContext,
  entityId: bigint,
  background: Background
) {
  const gltfScene = context.scenes.get(entityId);
  if (!gltfScene) return;

  const texture = context.textures.get(background.imageId);
  if (!texture) return;

  const extension = context.doc.createExtension(UNVBackground);
  const property = extension.createBackground();

  property.setTexture(texture);

  gltfScene.setExtension(property.extensionName, property);
}
