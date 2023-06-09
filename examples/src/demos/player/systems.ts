import { Asset, CoreStore, Warehouse } from "lattice-engine/core";
import { InputStruct } from "lattice-engine/input";
import {
  BoxCollider,
  DynamicBody,
  PhysicsConfig,
  SphereCollider,
  StaticBody,
  TargetTransform,
} from "lattice-engine/physics";
import { WEBGL_CONSTANTS } from "lattice-engine/render";
import {
  GlobalTransform,
  Image,
  Material,
  Mesh,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Text } from "lattice-engine/text";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createPlayer } from "../../utils/createPlayer";
import { createScene } from "../../utils/createScene";
import { createBoxGeometry, createSphereGeometry } from "../../utils/geometry";

export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  inputStruct: Res<Mut<InputStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const { scene, root } = createScene(
    commands,
    coreStore,
    sceneStruct,
    4096,
    16
  );

  createPlayer([0, 4, 0], scene, commands, sceneStruct, inputStruct);

  const asset = new Asset("/DevGrid.png");
  const devTexture = commands.spawn().add(asset).addType(Image);
  dropStruct(asset);

  const builder = new SceneBuilder(commands, warehouse);

  builder
    .createBox([32, 1, 32], devTexture.id, builder.transform.set([0, -0.5, 0]))
    .add(builder.parent.setEntity(root));

  const stairs = commands
    .spawn()
    .add(builder.parent.setEntity(root))
    .add(builder.transform.set([-2, 0, -6]))
    .addType(GlobalTransform);

  builder
    .createStairs(2, 0.125, 1, 10, devTexture.id)
    .add(builder.parent.setEntity(stairs))
    .add(builder.transform.set([0, 0, 0]))
    .addType(GlobalTransform);

  builder
    .createStairs(2, 0.125, 0.5, 20, devTexture.id)
    .add(builder.parent.setEntity(stairs))
    .add(builder.transform.set([-3, 0, 0]))
    .addType(GlobalTransform);

  builder
    .createStairs(2, 0.25, 0.5, 20, devTexture.id)
    .add(builder.parent.setEntity(stairs))
    .add(builder.transform.set([-6, 0, 0]))
    .addType(GlobalTransform);

  const ramps = commands
    .spawn()
    .add(builder.parent.setEntity(root))
    .add(builder.transform.set([2, 0, -6]))
    .addType(GlobalTransform);

  builder
    .createRamp(2, 10, 1, 15, devTexture.id)
    .add(builder.parent.setEntity(ramps))
    .add(builder.transform.set([0, 0, 0]))
    .addType(GlobalTransform);

  builder
    .createRamp(2, 10, 1, 30, devTexture.id)
    .add(builder.parent.setEntity(ramps))
    .add(builder.transform.set([3, 0, 0]))
    .addType(GlobalTransform);

  builder
    .createRamp(2, 10, 1, 45, devTexture.id)
    .add(builder.parent.setEntity(ramps))
    .add(builder.transform.set([6, 0, 0]))
    .addType(GlobalTransform);

  builder
    .createRamp(2, 10, 1, 60, devTexture.id)
    .add(builder.parent.setEntity(ramps))
    .add(builder.transform.set([9, 0, 0]))
    .addType(GlobalTransform);

  const ballRadius = 1;
  const ballGeometry = createSphereGeometry(warehouse, ballRadius);
  const sphereCollider = new SphereCollider(ballRadius);
  const targetTransform = new TargetTransform();

  commands
    .spawn()
    .add(builder.parent.setEntity(root))
    .add(builder.transform.set([0, 3, 8]))
    .add(targetTransform.set([0, 3, 8]))
    .addType(GlobalTransform)
    .add(ballGeometry)
    .addType(Mesh)
    .add(sphereCollider)
    .addType(DynamicBody);

  dropStruct(ballGeometry);
  dropStruct(sphereCollider);
  dropStruct(targetTransform);

  builder.destroy();
}

class SceneBuilder {
  transform = new Transform();
  parent = new Parent();
  boxCollider = new BoxCollider();
  mesh = new Mesh();
  material = new Material();
  text = new Text();

  commands: Commands;
  warehouse: Readonly<Warehouse>;

  constructor(commands: Commands, warehouse: Readonly<Warehouse>) {
    this.commands = commands;
    this.warehouse = warehouse;
  }

  createRamp(
    rampWidth: number,
    rampHeight: number,
    rampDepth: number,
    rampAngle: number,
    textureId: bigint
  ) {
    const ramp = this.commands.spawn();

    // Angle -> quaternion
    const angle = (rampAngle * Math.PI) / 180;
    const x = Math.sin(angle / 2);
    const y = 0;
    const z = 0;
    const w = Math.cos(angle / 2);

    this.createBox(
      [rampWidth, rampDepth, rampHeight],
      textureId,
      this.transform.set([0, 0, 0], [x, y, z, w])
    ).add(this.parent.setEntity(ramp));

    this.text.text = `Angle: ${rampAngle}°`;
    this.text.fontSize = 0.3;

    this.commands
      .spawn()
      .add(this.parent.setEntity(ramp))
      .add(this.transform.set([0, 3, 0], [0, 0, 0, 1]))
      .addType(GlobalTransform)
      .add(this.text);

    return ramp;
  }

  createStairs(
    stairWidth: number,
    stepHeight: number,
    stepWidth: number,
    steps: number,
    textureId: bigint
  ) {
    const stairs = this.commands.spawn();

    const materialId = this.createMaterial(
      textureId,
      stepWidth / 2,
      stepWidth / 2
    );

    for (let i = 0; i < steps; i++) {
      const box = this.createBox(
        [stairWidth, stepHeight, stepWidth],
        textureId,
        this.transform.set([
          0,
          stepHeight * i + stepHeight / 2,
          -stepWidth * i + stepWidth / 2,
        ]),
        materialId
      );
      box.add(this.parent.setEntity(stairs));
    }

    this.text.text = `Step height: ${stepHeight}m\nStep width: ${stepWidth}m`;
    this.text.fontSize = 0.3;

    this.commands
      .spawn()
      .add(this.parent.setEntity(stairs))
      .add(this.transform.set([0, 3, 0]))
      .addType(GlobalTransform)
      .add(this.text);

    return stairs;
  }

  createBox(
    size: [number, number, number],
    textureId: bigint,
    transform: Transform,
    materialId?: bigint
  ) {
    const geometry = createBoxGeometry(this.warehouse, size);

    this.boxCollider.size.fromArray(size);

    this.mesh.materialId =
      materialId ?? this.createMaterial(textureId, size[0] / 2, size[2] / 2);

    const entity = this.commands
      .spawn()
      .add(transform)
      .addType(GlobalTransform)
      .add(geometry)
      .add(this.mesh)
      .add(this.boxCollider)
      .addType(StaticBody);

    dropStruct(geometry);

    return entity;
  }

  createMaterial(textureId: bigint, scaleX = 1, scaleY = 1) {
    this.material.roughness = 1;
    this.material.metalness = 0;
    this.material.baseColorTextureId = textureId;
    this.material.baseColorTextureInfo.wrapS = WEBGL_CONSTANTS.REPEAT;
    this.material.baseColorTextureInfo.wrapT = WEBGL_CONSTANTS.REPEAT;
    this.material.baseColorTextureInfo.minFilter =
      WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;
    this.material.baseColorTextureInfo.scale.set(scaleX, scaleY);

    const materialEntity = this.commands.spawn().add(this.material);
    return materialEntity.id;
  }

  destroy() {
    dropStruct(this.transform);
    dropStruct(this.parent);
    dropStruct(this.boxCollider);
    dropStruct(this.mesh);
    dropStruct(this.material);
    dropStruct(this.text);
  }
}
