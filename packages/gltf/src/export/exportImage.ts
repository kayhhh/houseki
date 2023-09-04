import { Asset, Warehouse } from "@lattice-engine/core";

import { ExportContext } from "./context";

export function exportImage(
  warehouse: Readonly<Warehouse>,
  context: ExportContext,
  entityId: bigint,
  asset: Asset
) {
  const texture = context.doc.createTexture();

  texture.setMimeType(asset.mimeType);

  if (asset.uri.startsWith("/")) {
    texture.setURI(asset.uri.slice(1));
  } else {
    texture.setURI(asset.uri);
  }

  const array = asset.data.read(warehouse);
  if (array) {
    texture.setImage(array);
  }

  context.textures.set(entityId, texture);
}
