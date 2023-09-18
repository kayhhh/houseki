import { CoreStore, Warehouse } from "houseki/core";
import { CascadingShadowMaps } from "houseki/csm";
import { RenderView } from "houseki/scene";
import { Commands, Mut, Res } from "thyseus";

import { createBox } from "../../utils/createBox";
import { createOrbitControls } from "../../utils/createOrbitControls";
import { createScene } from "../../utils/createScene";

const GROUND_SIZE = 40;
const BOX_COUNT = 60;
const BOX_SCALE = 2;

export function initScene(
  warehouse: Res<Mut<Warehouse>>,
  commands: Commands,
  coreStore: Res<Mut<CoreStore>>
) {
  const cameraId = createOrbitControls(commands);
  const { viewId, sceneId } = createScene(commands, coreStore);

  commands.getById(viewId).add(new RenderView(cameraId));

  const csm = new CascadingShadowMaps();
  csm.shadowMapSize = 4096;
  csm.far = GROUND_SIZE * 0.75;

  commands.getById(cameraId).add(csm);

  createBox(warehouse, commands, {
    parentId: sceneId,
    size: [GROUND_SIZE, 1, GROUND_SIZE],
    translation: [0, -1, 0],
  });

  for (let i = 0; i < BOX_COUNT; i++) {
    const scale = Math.random() * BOX_SCALE + 0.5;
    const x = (Math.random() - 0.5) * GROUND_SIZE;
    const z = (Math.random() - 0.5) * GROUND_SIZE;
    const y = scale * 1.5;

    createBox(warehouse, commands, {
      parentId: sceneId,
      size: [scale, scale, scale],
      translation: [x, y, z],
    });
  }
}
