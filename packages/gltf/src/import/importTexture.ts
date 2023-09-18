import { Texture } from "@gltf-transform/core";
import { Asset, Warehouse } from "@houseki-engine/core";
import { Commands } from "thyseus";

export function importTexture(
  warehouse: Warehouse,
  gltfTexture: Texture | null,
  commands: Commands
) {
  if (!gltfTexture) return;

  const imageData = gltfTexture.getImage();
  if (!imageData) return;

  const asset = new Asset();
  asset.data.write(imageData, warehouse);
  asset.mimeType = gltfTexture.getMimeType();

  const imageId = commands.spawn(true).add(asset).addType(Image).id;

  return imageId;
}
