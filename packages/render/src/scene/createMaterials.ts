import {
  Material,
  MaterialAlphaMode,
  TextureInfo,
} from "@lattice-engine/scene";
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  DoubleSide,
  FrontSide,
  LinearFilter,
  LinearMipMapLinearFilter,
  LinearMipMapNearestFilter,
  MeshStandardMaterial,
  MirroredRepeatWrapping,
  NearestFilter,
  NearestMipMapLinearFilter,
  NearestMipMapNearestFilter,
  RepeatWrapping,
  sRGBEncoding,
  Texture as ThreeTexture,
} from "three";
import { Entity, Query, Res } from "thyseus";

import { WEBGL_CONSTANTS } from "../constants";
import { RenderStore } from "../RenderStore";

/**
 * Creates and updates material objects.
 */
export function createMaterials(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, Material]>
) {
  const ids: bigint[] = [];

  for (const [{ id }, material] of entities) {
    ids.push(id);

    let object = renderStore.materials.get(id);

    // Create new objects
    if (!object) {
      object = new MeshStandardMaterial();
      renderStore.materials.set(id, object);
    }

    // Sync object properties
    object.side = material.doubleSided ? DoubleSide : FrontSide;
    object.opacity = material.baseColor[3] ?? 1;

    switch (material.alphaMode) {
      case MaterialAlphaMode.OPAQUE: {
        object.transparent = false;
        object.depthWrite = true;
        object.alphaTest = 0;
        break;
      }

      case MaterialAlphaMode.MASK: {
        object.transparent = false;
        object.depthWrite = true;
        object.alphaTest = material.alphaCutOff;
        break;
      }

      case MaterialAlphaMode.BLEND: {
        object.transparent = true;
        object.depthWrite = false;
        object.alphaTest = 0;
        break;
      }
    }

    object.color.fromArray(material.baseColor);
    object.emissive.fromArray(material.emissiveFactor);
    object.normalScale.set(material.normalScale, material.normalScale);
    object.aoMapIntensity = material.occlusionStrength;
    object.metalness = material.metalness;
    object.roughness = material.roughness;

    object.map = loadTexture(
      object.map,
      material.baseColorTextureId,
      material.baseColorTextureInfo,
      renderStore
    );
    if (object.map) object.map.encoding = sRGBEncoding;

    object.normalMap = loadTexture(
      object.normalMap,
      material.normalTextureId,
      material.normalTextureInfo,
      renderStore
    );

    object.aoMap = loadTexture(
      object.aoMap,
      material.occlusionTextureId,
      material.occlusionTextureInfo,
      renderStore
    );

    object.emissiveMap = loadTexture(
      object.emissiveMap,
      material.emissiveTextureId,
      material.emissiveTextureInfo,
      renderStore
    );
    if (object.emissiveMap) object.emissiveMap.encoding = sRGBEncoding;

    const mrTexture = loadTexture(
      object.metalnessMap,
      material.metallicRoughnessTextureId,
      material.metallicRoughnessTextureInfo,
      renderStore
    );
    object.metalnessMap = mrTexture;
    object.roughnessMap = mrTexture;

    object.needsUpdate = true;
  }

  // Remove objects that no longer exist
  for (const [id] of renderStore.materials) {
    if (!ids.includes(id)) {
      const object = renderStore.materials.get(id);

      if (object) {
        object.dispose();
        object.map?.dispose();
        object.normalMap?.dispose();
        object.aoMap?.dispose();
        object.emissiveMap?.dispose();
        object.metalnessMap?.dispose();
        object.roughnessMap?.dispose();
      }

      renderStore.materials.delete(id);
    }
  }
}

function loadTexture(
  object: ThreeTexture | null,
  textureId: bigint,
  info: TextureInfo,
  renderStore: Readonly<RenderStore>
) {
  const newObject = getTextureObject(object, textureId, renderStore);
  if (!newObject) return null;

  applyTextureInfo(newObject, info);

  return newObject;
}

function getTextureObject(
  object: ThreeTexture | null,
  textureId: bigint,
  renderStore: Readonly<RenderStore>
) {
  // If the image is already loaded, use it
  const bitmap = renderStore.images.get(textureId);
  if (!bitmap) return null;

  // If the texture is already created, update it
  if (object) {
    // If the texture is already using the image, do nothing
    if (object.image === bitmap) return object;

    object.image = bitmap;
    object.needsUpdate = true;
    return object;
  }

  // Create a new texture
  const newObject = new CanvasTexture(bitmap);
  newObject.needsUpdate = true;
  return newObject;
}

function applyTextureInfo(object: ThreeTexture, info: TextureInfo) {
  object.offset.fromArray(info.offset);
  object.repeat.fromArray(info.scale);
  object.rotation = info.rotation;

  switch (info.magFilter) {
    case WEBGL_CONSTANTS.NEAREST: {
      object.magFilter = NearestFilter;
      break;
    }

    case WEBGL_CONSTANTS.LINEAR:
    default: {
      object.magFilter = LinearFilter;
      break;
    }
  }

  switch (info.minFilter) {
    case WEBGL_CONSTANTS.NEAREST: {
      object.minFilter = NearestFilter;
      break;
    }

    case WEBGL_CONSTANTS.NEAREST_MIPMAP_NEAREST: {
      object.minFilter = NearestMipMapNearestFilter;
      break;
    }

    case WEBGL_CONSTANTS.NEAREST_MIPMAP_LINEAR: {
      object.minFilter = NearestMipMapLinearFilter;
      break;
    }

    case WEBGL_CONSTANTS.LINEAR_MIPMAP_NEAREST: {
      object.minFilter = LinearMipMapNearestFilter;
      break;
    }

    case WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR: {
      object.minFilter = LinearMipMapLinearFilter;
      break;
    }

    case WEBGL_CONSTANTS.LINEAR:
    default: {
      object.minFilter = LinearFilter;
      break;
    }
  }

  switch (info.wrapS) {
    case WEBGL_CONSTANTS.CLAMP_TO_EDGE: {
      object.wrapS = ClampToEdgeWrapping;
      break;
    }

    case WEBGL_CONSTANTS.MIRRORED_REPEAT: {
      object.wrapS = MirroredRepeatWrapping;
      break;
    }

    case WEBGL_CONSTANTS.REPEAT:
    default: {
      object.wrapS = RepeatWrapping;
      break;
    }
  }

  switch (info.wrapT) {
    case WEBGL_CONSTANTS.CLAMP_TO_EDGE: {
      object.wrapT = ClampToEdgeWrapping;
      break;
    }

    case WEBGL_CONSTANTS.MIRRORED_REPEAT: {
      object.wrapT = MirroredRepeatWrapping;
      break;
    }

    case WEBGL_CONSTANTS.REPEAT:
    default: {
      object.wrapT = RepeatWrapping;
      break;
    }
  }
}
