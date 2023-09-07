import { Asset, Warehouse } from "reddo/core";
import { BoxCollider, StaticBody } from "reddo/physics";
import { WEBGL_CONSTANTS } from "reddo/render";
import {
  GlobalTransform,
  Image,
  Mesh,
  Parent,
  StandardMaterial,
  Transform,
} from "reddo/scene";
import { Commands, Mut, Res } from "thyseus";

import { createBoxGeometry } from "./geometry";

export function cleanupMaterials() {
  _textureId = undefined;
  materials.clear();
}

let _textureId: bigint | undefined = undefined;

function getTextureId(commands: Commands) {
  if (_textureId) return _textureId;

  const asset = new Asset("/DevGrid.png", "image/png");
  _textureId = commands.spawn(true).add(asset).addType(Image).id;

  return _textureId;
}

/**
 * ScaleX -> ScaleZ -> Material ID
 */
const materials = new Map<number, Map<number, bigint>>();

function createMaterial(commands: Commands, scaleX: number, scaleZ: number) {
  const textureId = getTextureId(commands);

  const material = new StandardMaterial();
  material.roughness = 1;
  material.metalness = 0;
  material.baseColorTextureId = textureId;
  material.baseColorTextureInfo.wrapS = WEBGL_CONSTANTS.REPEAT;
  material.baseColorTextureInfo.wrapT = WEBGL_CONSTANTS.REPEAT;
  material.baseColorTextureInfo.minFilter =
    WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;
  material.baseColorTextureInfo.scale.set(scaleX, scaleZ);

  const materialId = commands.spawn(true).add(material).id;

  const materialMap = materials.get(scaleX) || new Map<number, bigint>();
  materialMap.set(scaleZ, materialId);
  materials.set(scaleX, materialMap);

  return materialId;
}

function getMaterialId(
  commands: Commands,
  scaleX: number,
  scaleZ: number
): bigint {
  const existingId = materials.get(scaleX)?.get(scaleZ);
  if (existingId) return existingId;

  return createMaterial(commands, scaleX, scaleZ);
}

export function createBox(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  options: {
    size?: [number, number, number];
    translation?: [number, number, number];
    rotation?: [number, number, number, number];
    parentId?: bigint;
    addTexture?: boolean;
    addCollider?: boolean;
  } = {}
) {
  const size = options.size || [1, 1, 1];
  const translation = options.translation || [0, 0, 0];
  const rotation = options.rotation || [0, 0, 0, 1];
  const parentId = options.parentId;
  const addTexture = options.addTexture ?? true;
  const addCollider = options.addCollider ?? true;

  const geometry = createBoxGeometry(warehouse, size);

  const transform = new Transform();
  const mesh = new Mesh();

  if (addTexture) {
    const materialId = getMaterialId(commands, size[0] / 2, size[2] / 2);
    mesh.materialId = materialId;
  }

  const boxId = commands
    .spawn(true)
    .add(transform.set(translation, rotation))
    .addType(GlobalTransform)
    .add(mesh)
    .add(geometry).id;

  if (parentId) {
    commands.getById(boxId).add(new Parent(parentId));
  }

  if (addCollider) {
    commands.getById(boxId).add(new BoxCollider(size)).addType(StaticBody);
  }

  return boxId;
}
