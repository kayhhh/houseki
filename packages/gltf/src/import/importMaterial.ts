import {
  Material as GltfMaterial,
  Texture as GltfTexture,
  TextureInfo as GltfTextureInfo,
} from "@gltf-transform/core";
import { Transform } from "@gltf-transform/extensions";
import { Asset, Warehouse } from "@lattice-engine/core";
import {
  Image,
  Material,
  MaterialAlphaMode,
  TextureInfo,
} from "@lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

import { ImportContext } from "./context";

export function importMaterial(
  gltfMaterial: GltfMaterial,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: ImportContext
) {
  const cached = context.materials.get(gltfMaterial);
  if (cached) return cached;

  const material = new Material();

  material.doubleSided = gltfMaterial.getDoubleSided();
  material.alphaCutoff = gltfMaterial.getAlphaCutoff();
  material.alphaMode = MaterialAlphaMode[gltfMaterial.getAlphaMode()];

  {
    const baseColor = gltfMaterial.getBaseColorFactor();
    material.baseColor.fromArray(baseColor);

    const gltfTexture = gltfMaterial.getBaseColorTexture();
    const texture = createTexture(gltfTexture, warehouse, commands);
    if (texture) {
      material.baseColorTextureId = texture.id;
      context.textureIds.push(texture.id);
    }

    const info = gltfMaterial.getBaseColorTextureInfo();
    applyTextureInfo(material.baseColorTextureInfo, info);
  }

  {
    const emissiveFactor = gltfMaterial.getEmissiveFactor();
    material.emissiveFactor.fromArray(emissiveFactor);

    const gltfTexture = gltfMaterial.getEmissiveTexture();
    const texture = createTexture(gltfTexture, warehouse, commands);
    if (texture) {
      material.emissiveTextureId = texture.id;
      context.textureIds.push(texture.id);
    }

    const info = gltfMaterial.getEmissiveTextureInfo();
    applyTextureInfo(material.emissiveTextureInfo, info);
  }

  {
    material.normalScale = gltfMaterial.getNormalScale();

    const gltfTexture = gltfMaterial.getNormalTexture();
    const texture = createTexture(gltfTexture, warehouse, commands);
    if (texture) {
      material.normalTextureId = texture.id;
      context.textureIds.push(texture.id);
    }

    const info = gltfMaterial.getNormalTextureInfo();
    applyTextureInfo(material.normalTextureInfo, info);
  }

  {
    material.occlusionStrength = gltfMaterial.getOcclusionStrength();

    const gltfTexture = gltfMaterial.getOcclusionTexture();
    const texture = createTexture(gltfTexture, warehouse, commands);
    if (texture) {
      material.occlusionTextureId = texture.id;
      context.textureIds.push(texture.id);
    }

    const info = gltfMaterial.getOcclusionTextureInfo();
    applyTextureInfo(material.occlusionTextureInfo, info);
  }

  {
    material.roughness = gltfMaterial.getRoughnessFactor();
    material.metalness = gltfMaterial.getMetallicFactor();

    const gltfTexture = gltfMaterial.getMetallicRoughnessTexture();
    const texture = createTexture(gltfTexture, warehouse, commands);
    if (texture) {
      material.metallicRoughnessTextureId = texture.id;
      context.textureIds.push(texture.id);
    }

    const info = gltfMaterial.getMetallicRoughnessTextureInfo();
    applyTextureInfo(material.metallicRoughnessTextureInfo, info);
  }

  // Create material entity
  const entity = commands.spawn().add(material);
  context.materials.set(gltfMaterial, entity.id);
  context.materialIds.push(entity.id);

  dropStruct(material);

  return entity.id;
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

  // KHR_texture_transform
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

  const image = commands.spawn().add(asset).addType(Image);

  dropStruct(asset);

  return image;
}
