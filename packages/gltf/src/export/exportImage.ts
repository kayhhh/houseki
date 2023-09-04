import { Asset, Warehouse } from "@lattice-engine/core";

import { ExportContext } from "./context";

export function exportImage(
  warehouse: Readonly<Warehouse>,
  context: ExportContext,
  entityId: bigint,
  asset: Asset
) {
  const texture = context.doc.createTexture();

  const mimeType = asset.mimeType;
  const uri = asset.uri;

  texture.setMimeType(mimeType);

  if (uri.startsWith("/")) {
    texture.setURI(uri.slice(1));
  } else {
    texture.setURI(uri);
  }

  const array = asset.data.read(warehouse);
  if (array) {
    texture.setImage(array);
  }

  context.textures.set(entityId, texture);
}
