import { CoreStore, Warehouse } from "lattice-engine/core";
import { PhysicsConfig } from "lattice-engine/physics";
import { Portal, PortalRaycast, PortalTarget } from "lattice-engine/portal";
import {
  GlobalTransform,
  Mesh,
  Parent,
  SceneStruct,
  StandardMaterial,
  Transform,
} from "lattice-engine/scene";
import { Quaternion, Vector3 } from "three";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createBox } from "../../utils/createBox";
import { createLights } from "../../utils/createLights";
import { createPlayer } from "../../utils/createPlayer";
import { createScene } from "../../utils/createScene";
import { createBoxGeometry } from "../../utils/geometry";

export function initScene(
  warehouse: Res<Warehouse>,
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>,
) {
  physicsConfig.debug = true;

  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId);
  createPlayer([0, 2, 0], rootId, commands, sceneStruct);

  commands.getById(sceneStruct.activeCamera).addType(PortalRaycast);

  createBox(commands, warehouse, {
    parentId: rootId,
    size: [30, 1, 30],
    translation: [0, -1, 0],
  });

  const transform = new Transform();
  const parent = new Parent(rootId);

  const portal = new Portal(3, 3);

  const up = new Vector3(0, 1, 0);
  const quaternion = new Quaternion();
  quaternion.setFromAxisAngle(up, Math.PI / 2.5);

  const aId = commands
    .spawn(true)
    .add(
      transform.set(
        [0, 1, -6],
        [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
      ),
    )
    .addType(GlobalTransform)
    .add(parent)
    .add(portal).id;

  quaternion.setFromAxisAngle(up, -Math.PI / 4);

  const bId = commands
    .spawn(true)
    .add(
      transform.set(
        [4, 1, -2],
        [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
      ),
    )
    .addType(GlobalTransform)
    .add(parent)
    .add(portal).id;

  dropStruct(portal);

  const portalTarget = new PortalTarget();

  portalTarget.id = bId;
  commands.getById(aId).add(portalTarget);

  portalTarget.id = aId;
  commands.getById(bId).add(portalTarget);

  dropStruct(portalTarget);

  const boxGeometry = createBoxGeometry(warehouse);
  const boxMaterial = new StandardMaterial([1, 0.3, 0.3, 1]);

  // Red box
  commands
    .spawn(true)
    .add(transform.set([-1, 0, 2], [0, 0, 0, 1]))
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(boxGeometry)
    .add(boxMaterial);

  boxMaterial.baseColor.set(0.6, 1, 0.4, 1);

  // Green box
  commands
    .spawn(true)
    .add(transform.set([1, 0, 2]))
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(boxGeometry)
    .add(boxMaterial);

  dropStruct(boxGeometry);
  dropStruct(boxMaterial);
  dropStruct(parent);
}
