import { Asset, CoreStore, Warehouse } from "lattice-engine/core";
import { InputStruct } from "lattice-engine/input";
import {
  BoxCollider,
  CapsuleCollider,
  CharacterController,
  DynamicBody,
  KinematicBody,
  PhysicsConfig,
  Raycast,
  SphereCollider,
  StaticBody,
  TargetTransform,
  Velocity,
} from "lattice-engine/physics";
import {
  PlayerAvatar,
  PlayerBody,
  PlayerCamera,
  PlayerCameraMode,
  PlayerCameraView,
  TargetPosition,
  TargetRotation,
} from "lattice-engine/player";
import { WEBGL_CONSTANTS } from "lattice-engine/render";
import {
  GlobalTransform,
  Image,
  Material,
  Mesh,
  Parent,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Text } from "lattice-engine/text";
import { Vrm } from "lattice-engine/vrm";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createScene } from "../../utils/createScene";
import { createBoxGeometry, createSphereGeometry } from "../../utils/geometry";

/**
 * System to initialize the scene.
 */
export function initScene(
  commands: Commands,
  warehouse: Res<Warehouse>,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  inputStruct: Res<Mut<InputStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const scene = createScene(commands, coreStore, sceneStruct, 4096, 16);

  const asset = new Asset("/DevGrid.png");
  const devTexture = commands.spawn().add(asset).addType(Image);
  dropStruct(asset);

  const builder = new SceneBuilder(commands, warehouse);

  builder
    .createBox([32, 1, 32], devTexture.id, builder.transform.set([0, -0.5, 0]))
    .add(builder.parent.setEntity(scene));

  const stairs = commands
    .spawn()
    .add(builder.parent.setEntity(scene))
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
    .add(builder.parent.setEntity(scene))
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

  const spawn = [0, 4, 0] as const;
  const playerHeight = 1.6;
  const playerWidth = 0.4;

  const player = new PlayerBody();
  player.spawnPoint.fromArray(spawn);

  const targetTransform = new TargetTransform();

  const body = commands
    .spawn()
    .add(builder.parent.setEntity(scene))
    .add(builder.transform.set(spawn))
    .add(targetTransform.set(spawn))
    .addType(GlobalTransform)
    .addType(Velocity)
    .add(new CapsuleCollider(playerWidth, playerHeight - playerWidth * 2))
    .addType(KinematicBody)
    .addType(CharacterController)
    .add(player);

  dropStruct(player);

  const playerAvatar = new PlayerAvatar();
  playerAvatar.idleAnimation = "/animation/Idle.fbx";
  playerAvatar.jumpAnimation = "/animation/Falling.fbx";
  playerAvatar.leftWalkAnimation = "/animation/LeftWalk.fbx";
  playerAvatar.rightWalkAnimation = "/animation/RightWalk.fbx";
  playerAvatar.sprintAnimation = "/animation/Sprint.fbx";
  playerAvatar.walkAnimation = "/animation/Walk.fbx";

  const targetRotation = new TargetRotation();

  const vrm = new Vrm("/k-robot.vrm", true);

  commands
    .spawn()
    .add(builder.transform.set([0, -playerHeight / 2, 0]))
    .addType(GlobalTransform)
    .add(targetRotation.set(0, 0, 0, 1))
    .add(builder.parent.setEntity(body))
    .add(vrm)
    .add(playerAvatar);

  dropStruct(playerAvatar);
  dropStruct(vrm);

  const playerCamera = new PlayerCamera(
    PlayerCameraMode.Both,
    PlayerCameraView.ThirdPerson
  );

  const camera = commands
    .spawn()
    .addType(Transform)
    .addType(GlobalTransform)
    .addType(TargetPosition)
    .add(targetRotation.set(0, 0, 0, 1))
    .add(builder.parent.setEntity(body))
    .addType(PerspectiveCamera)
    .add(playerCamera)
    .addType(Raycast);

  dropStruct(playerCamera);
  dropStruct(targetRotation);

  sceneStruct.activeCamera = camera.id;
  inputStruct.enablePointerLock = true;

  const ballRadius = 1;
  const ballGeometry = createSphereGeometry(warehouse, ballRadius);
  const sphereCollider = new SphereCollider(ballRadius);

  commands
    .spawn()
    .add(builder.parent.setEntity(scene))
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

    for (let i = 0; i < steps; i++) {
      const box = this.createBox(
        [stairWidth, stepHeight, stepWidth],
        textureId,
        this.transform.set([
          0,
          stepHeight * i + stepHeight / 2,
          -stepWidth * i + stepWidth / 2,
        ])
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
    transform: Transform
  ) {
    const geometry = createBoxGeometry(this.warehouse, size);

    this.boxCollider.size.fromArray(size);

    this.material.roughness = 1;
    this.material.metalness = 0;
    this.material.baseColorTextureId = textureId;
    this.material.baseColorTextureInfo.wrapS = WEBGL_CONSTANTS.REPEAT;
    this.material.baseColorTextureInfo.wrapT = WEBGL_CONSTANTS.REPEAT;
    this.material.baseColorTextureInfo.minFilter =
      WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;
    this.material.baseColorTextureInfo.scale.set([size[0] / 2, size[2] / 2]);

    const materialEntity = this.commands.spawn().add(this.material);
    this.mesh.materialId = materialEntity.id;

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

  destroy() {
    dropStruct(this.transform);
    dropStruct(this.parent);
    dropStruct(this.boxCollider);
    dropStruct(this.mesh);
    dropStruct(this.material);
    dropStruct(this.text);
  }
}
