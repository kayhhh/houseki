import { CoreStore, Warehouse } from "lattice-engine/core";
import { PortalMaterial } from "lattice-engine/portal";
import {
  GlobalTransform,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Parent,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct, Mut, Res } from "thyseus";

import { createLights } from "../../utils/createLights";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";
import { createBoxGeometry, createPlaneGeometry } from "../../utils/geometry";

export function initScene(
  warehouse: Res<Warehouse>,
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>,
  sceneStruct: Res<Mut<SceneStruct>>
) {
  createOrbitControls(commands, sceneStruct);
  const { rootId, sceneId } = createScene(commands, coreStore, sceneStruct);
  createLights(commands, sceneId);

  const geometry = createPlaneGeometry(warehouse, 2, 2);
  const transform = new Transform([-1.25, 0, 0]);
  const parent = new Parent(rootId);

  const portalA = commands
    .spawn()
    .add(transform)
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .addType(MeshBasicMaterial)
    .add(geometry);

  const portalB = commands
    .spawn()
    .add(transform.set([1.25, 0, 0]))
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .addType(MeshBasicMaterial)
    .add(geometry);

  dropStruct(geometry);

  const portal = new PortalMaterial();

  portal.targetId = portalB.id;
  portalA.add(portal);

  portal.targetId = portalA.id;
  portalB.add(portal);

  dropStruct(portal);

  const boxGeometry = createBoxGeometry(warehouse);
  const boxMaterial = new MeshStandardMaterial([1, 0.3, 0.3, 1]);

  commands
    .spawn(true)
    .add(transform.set([-1, 0, 2]))
    .addType(GlobalTransform)
    .add(parent)
    .addType(Mesh)
    .add(boxGeometry)
    .add(boxMaterial);

  boxMaterial.baseColor.set(0.6, 1, 0.4, 1);

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
