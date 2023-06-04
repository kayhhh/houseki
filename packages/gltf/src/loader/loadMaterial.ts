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
import { Commands } from "thyseus";

import { LoadingContext } from "./context";

export function loadMaterial(
  gltfMaterial: GltfMaterial,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: LoadingContext
) {
  const material = new Material();

  material.doubleSided = gltfMaterial.getDoubleSided();
  material.alphaCutOff = gltfMaterial.getAlphaCutoff();
  material.alphaMode = MaterialAlphaMode[gltfMaterial.getAlphaMode()];

  {
    const baseColor = gltfMaterial.getBaseColorFactor();
    material.baseColor = new Float32Array(baseColor);

    const gltfTexture = gltfMaterial.getBaseColorTexture();
    const texture = createTexture(gltfTexture, warehouse, commands);
    if (texture) {
      material.baseColorTextureId = texture.id;
      context.textures.push(texture.id);
    }

    const info = gltfMaterial.getBaseColorTextureInfo();
    applyTextureInfo(material.baseColorTextureInfo, info);
  }

  {
    const emissiveFactor = gltfMaterial.getEmissiveFactor();
    material.emissiveFactor = new Float32Array(emissiveFactor);

    const gltfTexture = gltfMaterial.getEmissiveTexture();
    const texture = createTexture(gltfTexture, warehouse, commands);
    if (texture) {
      material.emissiveTextureId = texture.id;
      context.textures.push(texture.id);
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
      context.textures.push(texture.id);
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
      context.textures.push(texture.id);
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
      context.textures.push(texture.id);
    }

    const info = gltfMaterial.getMetallicRoughnessTextureInfo();
    applyTextureInfo(material.metallicRoughnessTextureInfo, info);
  }

  // Create material entity
  const entity = commands.spawn().add(material);
  context.materials.push(entity.id);

  return entity;
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
    info.offset.set(transform.getOffset());
    info.scale.set(transform.getScale());
  } else {
    info.rotation = 0;
    info.offset.set([0, 0]);
    info.scale.set([1, 1]);
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

  return commands.spawn().add(asset).addType(Image);
}
