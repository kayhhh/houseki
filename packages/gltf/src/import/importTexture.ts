import { Texture } from "@gltf-transform/core";
import { Asset, Warehouse } from "@houseki-engine/core";
import { Image } from "@houseki-engine/scene";
import { Commands } from "thyseus";

export function importTexture(
  warehouse: Warehouse,
  gltfTexture: Texture | null,
  commands: Commands,
  flipY = false
) {
  if (!gltfTexture) return;

  const imageData = gltfTexture.getImage();
  if (!imageData) return;

  const asset = new Asset();
  asset.data.write(imageData, warehouse);
  asset.mimeType = gltfTexture.getMimeType();

  const image = new Image(flipY);
  const imageId = commands.spawn(true).add(asset).add(image).id;

  return imageId;
}
