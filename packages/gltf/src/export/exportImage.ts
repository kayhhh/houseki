import { Asset, Warehouse } from "@lattice-engine/core";

import { ExportContext } from "./context";

export function exportImage(
  context: ExportContext,
  warehouse: Warehouse,
  entityId: bigint,
  asset: Asset
) {
  const texture = context.doc.createTexture();

  const mimeType = asset.mimeType.read(warehouse) ?? "";
  const uri = asset.uri.read(warehouse) ?? "";

  texture.setMimeType(mimeType);

  if (uri.startsWith("/")) {
    texture.setURI(uri.slice(1));
  } else {
    texture.setURI(uri);
  }

  const buffer = asset.data.read(warehouse);

  if (buffer) {
    const array = new Uint8Array(buffer);
    texture.setImage(array);
  }

  context.textures.set(entityId, texture);
}
