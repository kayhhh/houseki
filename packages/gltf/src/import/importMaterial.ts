import {
  Material,
  Texture as GltfTexture,
  TextureInfo as GltfTextureInfo,
} from "@gltf-transform/core";
import { Transform } from "@gltf-transform/extensions";
import { Asset, Warehouse } from "@lattice-engine/core";
import {
  Image,
  MaterialAlphaMode,
  StandardMaterial,
  TextureInfo,
} from "@lattice-engine/scene";
import { Commands } from "thyseus";

import { ImportContext } from "./context";

export function importMaterial(
  gltfMaterial: Material,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: ImportContext
) {
  const cached = context.materials.get(gltfMaterial);
  if (cached) return cached;

  const material = new StandardMaterial();

  material.doubleSided = gltfMaterial.getDoubleSided();
  material.alphaCutoff = gltfMaterial.getAlphaCutoff();
  material.alphaMode = MaterialAlphaMode[gltfMaterial.getAlphaMode()];

  {
    const baseColor = gltfMaterial.getBaseColorFactor();
    material.baseColor.fromArray(baseColor);

    const gltfTexture = gltfMaterial.getBaseColorTexture();
    const textureId = createTexture(gltfTexture, warehouse, commands);
    if (textureId) {
      material.baseColorTextureId = textureId;
      context.textureIds.push(textureId);
    }

    const info = gltfMaterial.getBaseColorTextureInfo();
    applyTextureInfo(material.baseColorTextureInfo, info);
  }

  {
    const emissiveFactor = gltfMaterial.getEmissiveFactor();
    material.emissiveFactor.fromArray(emissiveFactor);

    const gltfTexture = gltfMaterial.getEmissiveTexture();
    const textureId = createTexture(gltfTexture, warehouse, commands);
    if (textureId) {
      material.emissiveTextureId = textureId;
      context.textureIds.push(textureId);
    }

    const info = gltfMaterial.getEmissiveTextureInfo();
    applyTextureInfo(material.emissiveTextureInfo, info);
  }

  {
    material.normalScale = gltfMaterial.getNormalScale();

    const gltfTexture = gltfMaterial.getNormalTexture();
    const textureId = createTexture(gltfTexture, warehouse, commands);
    if (textureId) {
      material.normalTextureId = textureId;
      context.textureIds.push(textureId);
    }

    const info = gltfMaterial.getNormalTextureInfo();
    applyTextureInfo(material.normalTextureInfo, info);
  }

  {
    material.occlusionStrength = gltfMaterial.getOcclusionStrength();

    const gltfTexture = gltfMaterial.getOcclusionTexture();
    const textureId = createTexture(gltfTexture, warehouse, commands);
    if (textureId) {
      material.occlusionTextureId = textureId;
      context.textureIds.push(textureId);
    }

    const info = gltfMaterial.getOcclusionTextureInfo();
    applyTextureInfo(material.occlusionTextureInfo, info);
  }

  {
    material.roughness = gltfMaterial.getRoughnessFactor();
    material.metalness = gltfMaterial.getMetallicFactor();

    const gltfTexture = gltfMaterial.getMetallicRoughnessTexture();
    const textureId = createTexture(gltfTexture, warehouse, commands);
    if (textureId) {
      material.metallicRoughnessTextureId = textureId;
      context.textureIds.push(textureId);
    }

    const info = gltfMaterial.getMetallicRoughnessTextureInfo();
    applyTextureInfo(material.metallicRoughnessTextureInfo, info);
  }

  context.name.value =
    gltfMaterial.getName() || `Material_${context.materials.size}`;

  const entityId = commands.spawn(true).add(material).id;

  context.materials.set(gltfMaterial, entityId);
  context.materialIds.push(entityId);

  return entityId;
}

function applyTextureInfo(info: TextureInfo, gltfInfo: GltfTextureInfo | null) {
  if (!gltfInfo) return;

  const magFilter = gltfInfo.getMagFilter();
  if (magFilter) info.magFilter = magFilter;

  const minFilter = gltfInfo.getMinFilter();
  if (minFilter) info.minFilter = minFilter;

  info.wrapS = gltfInfo.getWrapS();
  info.wrapT = gltfInfo.getWrapT();
  info.texCoord = gltfInfo.getTexCoord();

  const transform = gltfInfo.getExtension<Transform>(Transform.EXTENSION_NAME);
  if (transform) {
    info.rotation = transform.getRotation();
    info.offset.fromArray(transform.getOffset());
    info.scale.fromArray(transform.getScale());
  } else {
    info.rotation = 0;
    info.offset.fromArray([0, 0]);
    info.scale.fromArray([1, 1]);
  }
}

function createTexture(
  gltfTexture: GltfTexture | null,
  warehouse: Readonly<Warehouse>,
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
