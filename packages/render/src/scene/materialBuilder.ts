import { Warehouse } from "@lattice-engine/core";
import {
  ImageMimeType,
  Material,
  MaterialAlphaMode,
  Texture,
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
import {
  Entity,
  Query,
  QueryDescriptor,
  Res,
  ResourceDescriptor,
  SystemRes,
  SystemResourceDescriptor,
} from "thyseus";

import { WEBGL_CONSTANTS } from "../constants";
import { RenderStore } from "../RenderStore";

class ImageStore {
  /**
   * Resource ID -> ImageBitmap
   */
  readonly images = new Map<number, ImageBitmap>();

  readonly processed = new Set<number>();
}

/**
 * Syncs Material components with Three.js Material objects.
 */
export function materialBuilder(
  warehouse: Res<Warehouse>,
  store: Res<RenderStore>,
  imageStore: SystemRes<ImageStore>,
  entities: Query<[Entity, Material]>
) {
  const ids: bigint[] = [];

  for (const [{ id }, material] of entities) {
    ids.push(id);

    let object = store.materials.get(id);

    // Create new objects
    if (!object) {
      object = new MeshStandardMaterial();
      store.materials.set(id, object);
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
      material.baseColorTexture,
      material.baseColorTextureInfo,
      imageStore,
      warehouse
    );
    if (object.map) object.map.encoding = sRGBEncoding;

    object.normalMap = loadTexture(
      object.normalMap,
      material.normalTexture,
      material.normalTextureInfo,
      imageStore,
      warehouse
    );

    object.aoMap = loadTexture(
      object.aoMap,
      material.occlusionTexture,
      material.occlusionTextureInfo,
      imageStore,
      warehouse
    );

    object.emissiveMap = loadTexture(
      object.emissiveMap,
      material.emissiveTexture,
      material.emissiveTextureInfo,
      imageStore,
      warehouse
    );
    if (object.emissiveMap) object.emissiveMap.encoding = sRGBEncoding;

    const mrTexture = loadTexture(
      object.metalnessMap,
      material.metallicRoughnessTexture,
      material.metallicRoughnessTextureInfo,
      imageStore,
      warehouse
    );
    object.metalnessMap = mrTexture;
    object.roughnessMap = mrTexture;

    object.needsUpdate = true;
  }

  // Remove objects that no longer exist
  for (const [id] of store.materials) {
    if (!ids.includes(id)) {
      const object = store.materials.get(id);
      object?.dispose();
      object?.map?.dispose();
      object?.normalMap?.dispose();
      object?.aoMap?.dispose();
      object?.emissiveMap?.dispose();
      object?.metalnessMap?.dispose();
      object?.roughnessMap?.dispose();

      store.materials.delete(id);
    }
  }
}

materialBuilder.parameters = [
  ResourceDescriptor(Warehouse),
  ResourceDescriptor(RenderStore),
  SystemResourceDescriptor(ImageStore),
  QueryDescriptor([Entity, Material]),
];

function loadTexture(
  object: ThreeTexture | null,
  texture: Texture,
  info: TextureInfo,
  imageStore: ImageStore,
  warehouse: Readonly<Warehouse>
) {
  const newObject = getTextureObject(object, texture, imageStore, warehouse);
  if (!newObject) return null;

  applyTextureInfo(newObject, info);

  return newObject;
}

function getTextureObject(
  object: ThreeTexture | null,
  texture: Texture,
  imageStore: ImageStore,
  warehouse: Readonly<Warehouse>
) {
  if (!texture.image.id) return null;

  // If the image is already loaded, use it
  const bitmap = imageStore.images.get(texture.image.id);
  if (bitmap) {
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

  // If already processing the image, return null
  if (imageStore.processed.has(texture.image.id)) return null;

  // Mark the image as processed
  imageStore.processed.add(texture.image.id);

  // Start loading the image
  const blob = new Blob([texture.image.read(warehouse)], {
    type: ImageMimeType[texture.mimeType],
  });

  createImageBitmap(blob, { imageOrientation: "flipY" }).then((bitmap) => {
    imageStore.images.set(texture.image.id, bitmap);
  });

  return null;
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
