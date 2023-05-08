import {
  Material as GltfMaterial,
  Texture as GltfTexture,
  TextureInfo as GltfTextureInfo,
} from "@gltf-transform/core";
import { Transform } from "@gltf-transform/extensions";
import {
  ImageMimeType,
  Material,
  MaterialAlphaMode,
  Texture,
  TextureInfo,
  Warehouse,
} from "@lattice-engine/core";
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

    const info = gltfMaterial.getBaseColorTextureInfo();
    applyTextureInfo(material.baseColorTextureInfo, info);
    const texture = gltfMaterial.getBaseColorTexture();
    applyTexture(material.baseColorTexture, texture, warehouse);
  }

  {
    const emissiveFactor = gltfMaterial.getEmissiveFactor();
    material.emissiveFactor = new Float32Array(emissiveFactor);

    const info = gltfMaterial.getEmissiveTextureInfo();
    applyTextureInfo(material.emissiveTextureInfo, info);
    const texture = gltfMaterial.getEmissiveTexture();
    applyTexture(material.emissiveTexture, texture, warehouse);
  }

  {
    material.normalScale = gltfMaterial.getNormalScale();

    const info = gltfMaterial.getNormalTextureInfo();
    applyTextureInfo(material.normalTextureInfo, info);
    const texture = gltfMaterial.getNormalTexture();
    applyTexture(material.normalTexture, texture, warehouse);
  }

  {
    material.occlusionStrength = gltfMaterial.getOcclusionStrength();

    const info = gltfMaterial.getOcclusionTextureInfo();
    applyTextureInfo(material.occlusionTextureInfo, info);
    const texture = gltfMaterial.getOcclusionTexture();
    applyTexture(material.occlusionTexture, texture, warehouse);
  }

  {
    material.roughness = gltfMaterial.getRoughnessFactor();
    material.metalness = gltfMaterial.getMetallicFactor();

    const info = gltfMaterial.getMetallicRoughnessTextureInfo();
    applyTextureInfo(material.metallicRoughnessTextureInfo, info);
    const texture = gltfMaterial.getMetallicRoughnessTexture();
    applyTexture(material.metallicRoughnessTexture, texture, warehouse);
  }

  // Create material entity
  const entity = commands.spawn().add(material);
  context.materials.push(entity.id);

  return entity;
}

function applyTextureInfo(info: TextureInfo, gltfInfo: GltfTextureInfo | null) {
  info.magFilter = gltfInfo?.getMagFilter() ?? 9729;
  info.minFilter = gltfInfo?.getMinFilter() ?? 9987;
  info.wrapS = gltfInfo?.getWrapS() ?? 10497;
  info.wrapT = gltfInfo?.getWrapT() ?? 10497;
  info.texCoord = gltfInfo?.getTexCoord() ?? 0;

  // KHR_texture_transform
  const transform = gltfInfo?.getExtension<Transform>(Transform.EXTENSION_NAME);
  if (transform) {
    info.rotation = transform.getRotation();
    info.offset = new Float32Array(transform.getOffset());
    info.scale = new Float32Array(transform.getScale());
  } else {
    info.rotation = 0;
    info.offset = new Float32Array([0, 0]);
    info.scale = new Float32Array([1, 1]);
  }
}

function applyTexture(
  texture: Texture,
  gltfTexture: GltfTexture | null,
  warehouse: Readonly<Warehouse>
) {
  if (!gltfTexture) return;

  const image = gltfTexture.getImage();
  if (!image) return;

  texture.image.write(image, warehouse);

  const mimeType = gltfTexture.getMimeType();

  const mimeNumber = ImageMimeType[mimeType as keyof typeof ImageMimeType] as
    | ImageMimeType
    | undefined;

  if (mimeNumber === undefined) {
    console.warn(`Unsupported mime type: ${mimeType}`);
  }

  texture.mimeType = mimeNumber ?? 0;
}
