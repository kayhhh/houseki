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
  physicsConfig: Res<Mut<PhysicsConfig>>
) {
  physicsConfig.debug = true;

  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId);
  createPlayer([0, 2, 0], rootId, commands, sceneStruct);

  commands.getById(sceneStruct.activeCamera).addType(PortalRaycast);

  createBox(commands, warehouse, {
    parentId: rootId,
    size: [10, 1, 10],
    translation: [0, -1, 0],
  });

  const transform = new Transform();
  const parent = new Parent(rootId);

  const portal = new Portal(3, 3);

  const aId = commands
    .spawn(true)
    .add(transform.set([-2, 1, -4]))
    .addType(GlobalTransform)
    .add(parent)
    .add(portal).id;

  const bId = commands
    .spawn(true)
    .add(transform.set([2, 1, -2]))
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
    .add(transform.set([-1, 0, 2]))
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
