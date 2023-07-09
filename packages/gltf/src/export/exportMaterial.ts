import { GLTF, TextureInfo as GltfTextureInfo } from "@gltf-transform/core";
import { KHRTextureTransform } from "@gltf-transform/extensions";
import {
  MaterialAlphaMode,
  MeshStandardMaterial,
  TextureInfo,
} from "@lattice-engine/scene";

import { ExportContext } from "./context";

export function exportMaterial(
  context: ExportContext,
  entityId: bigint,
  material: MeshStandardMaterial,
) {
  const gltfMaterial = context.doc.createMaterial();

  gltfMaterial.setDoubleSided(material.doubleSided);

  gltfMaterial.setAlphaCutoff(material.alphaCutoff);
  gltfMaterial.setAlphaMode(
    MaterialAlphaMode[material.alphaMode] as GLTF.MaterialAlphaMode,
  );

  gltfMaterial.setBaseColorFactor(material.baseColor.toArray());
  gltfMaterial.setEmissiveFactor(material.emissiveFactor.toArray());
  gltfMaterial.setNormalScale(material.normalScale);
  gltfMaterial.setOcclusionStrength(material.occlusionStrength);
  gltfMaterial.setRoughnessFactor(material.roughness);
  gltfMaterial.setMetallicFactor(material.metalness);

  if (material.baseColorTextureId) {
    const texture = context.textures.get(material.baseColorTextureId);
    if (texture) gltfMaterial.setBaseColorTexture(texture);

    const info = gltfMaterial.getBaseColorTextureInfo();
    if (info) setTextureInfo(info, material.baseColorTextureInfo, context);
  }

  if (material.emissiveTextureId) {
    const texture = context.textures.get(material.emissiveTextureId);
    if (texture) gltfMaterial.setEmissiveTexture(texture);

    const info = gltfMaterial.getEmissiveTextureInfo();
    if (info) setTextureInfo(info, material.emissiveTextureInfo, context);
  }

  if (material.normalTextureId) {
    const texture = context.textures.get(material.normalTextureId);
    if (texture) gltfMaterial.setNormalTexture(texture);

    const info = gltfMaterial.getNormalTextureInfo();
    if (info) setTextureInfo(info, material.normalTextureInfo, context);
  }

  if (material.occlusionTextureId) {
    const texture = context.textures.get(material.occlusionTextureId);
    if (texture) gltfMaterial.setOcclusionTexture(texture);

    const info = gltfMaterial.getOcclusionTextureInfo();
    if (info) setTextureInfo(info, material.occlusionTextureInfo, context);
  }

  if (material.metallicRoughnessTextureId) {
    const texture = context.textures.get(material.metallicRoughnessTextureId);
    if (texture) gltfMaterial.setMetallicRoughnessTexture(texture);

    const info = gltfMaterial.getMetallicRoughnessTextureInfo();
    if (info)
      setTextureInfo(info, material.metallicRoughnessTextureInfo, context);
  }

  context.materials.set(entityId, gltfMaterial);
}

function setTextureInfo(
  gltfInfo: GltfTextureInfo,
  info: TextureInfo,
  context: ExportContext,
) {
  gltfInfo.setMagFilter(info.magFilter as GLTF.TextureMagFilter);
  gltfInfo.setMinFilter(info.minFilter as GLTF.TextureMinFilter);
  gltfInfo.setWrapS(info.wrapS as GLTF.TextureWrapMode);
  gltfInfo.setWrapT(info.wrapT as GLTF.TextureWrapMode);
  gltfInfo.setTexCoord(info.texCoord);

  const isDefaultTransform =
    info.rotation === 0 &&
    info.scale.x === 1 &&
    info.scale.y === 1 &&
    info.offset.x === 0 &&
    info.offset.y === 0;

  if (!isDefaultTransform) {
    const transformExt = context.doc.createExtension(KHRTextureTransform);
    const transform = transformExt.createTransform();
    gltfInfo.setExtension(transform.extensionName, transform);

    transform.setRotation(info.rotation);
    transform.setScale(info.scale.toArray());
    transform.setOffset(info.offset.toArray());
  }
}
