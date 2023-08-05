import { Asset } from "@lattice-engine/core";

import { ExportContext } from "./context";

export function exportImage(
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

  const array = new Uint8Array(asset.data);
  texture.setImage(array);

  context.textures.set(entityId, texture);
}
