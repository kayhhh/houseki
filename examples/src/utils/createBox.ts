import { Asset, Warehouse } from "lattice-engine/core";
import { WEBGL_CONSTANTS } from "lattice-engine/render";
import {
  GlobalTransform,
  Image,
  Mesh,
  MeshStandardMaterial,
  Parent,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

import { createBoxGeometry } from "./geometry";

let _textureId: bigint | undefined = undefined;

function getTextureId(commands: Commands) {
  if (_textureId) return _textureId;

  const asset = new Asset("/DevGrid.png");
  _textureId = commands.spawn(true).add(asset).addType(Image).id;
  dropStruct(asset);

  return _textureId;
}

/**
 * Scale -> MaterialId
 */
const materials = new Map<number, bigint>();

function createMaterial(commands: Commands, scale: number) {
  const textureId = getTextureId(commands);

  const material = new MeshStandardMaterial();
  material.roughness = 1;
  material.metalness = 0;
  material.baseColorTextureId = textureId;
  material.baseColorTextureInfo.wrapS = WEBGL_CONSTANTS.REPEAT;
  material.baseColorTextureInfo.wrapT = WEBGL_CONSTANTS.REPEAT;
  material.baseColorTextureInfo.minFilter =
    WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;
  material.baseColorTextureInfo.scale.set(scale, scale);

  const materialId = commands.spawn(true).add(material).id;

  dropStruct(material);

  materials.set(scale, materialId);

  return materialId;
}

function getMaterialId(commands: Commands, scale: number): bigint {
  const existingId = materials.get(scale);
  if (existingId) return existingId;

  return createMaterial(commands, scale);
}

export function createBox(
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  options: {
    size?: [number, number, number];
    position?: [number, number, number];
    parentId?: bigint;
    addTexture?: boolean;
  } = {}
) {
  const size = options.size || [1, 1, 1];
  const position = options.position || [0, 0, 0];
  const parentId = options.parentId;
  const addTexture = options.addTexture ?? true;

  const geometry = createBoxGeometry(warehouse, size);

  const transform = new Transform();
  const mesh = new Mesh();

  if (addTexture) {
    const materialId = getMaterialId(commands, size[0]);
    mesh.materialId = materialId;
  }

  const boxId = commands
    .spawn(true)
    .add(transform.set(position))
    .addType(GlobalTransform)
    .add(mesh)
    .add(geometry).id;

  if (parentId) {
    const parent = new Parent(parentId);
    commands.getById(boxId).add(parent);
    dropStruct(parent);
  }

  dropStruct(geometry);
  dropStruct(mesh);

  return boxId;
}
