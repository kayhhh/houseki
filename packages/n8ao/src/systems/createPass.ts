import { RenderStore } from "@lattice-engine/render";
import { SceneStruct } from "@lattice-engine/scene";
import { Query, Res } from "thyseus";

import { N8AOPass } from "../components";
import { N8AOStore } from "../resources";
import { QualityMode } from "../types";

export function createPass(
  sceneStruct: Res<SceneStruct>,
  renderStore: Res<RenderStore>,
  aoStore: Res<N8AOStore>,
  passes: Query<N8AOPass>
) {
  for (const pass of passes) {
    const cameraId = sceneStruct.activeCamera;
    if (cameraId === null) return;

    const camera = renderStore.perspectiveCameras.get(cameraId);
    if (!camera) return;

    const sceneId = sceneStruct.activeScene;
    if (sceneId === null) return;

    const scene = renderStore.scenes.get(sceneId);
    if (!scene) return;

    aoStore.pass.camera = camera;
    aoStore.pass.scene = scene;

    aoStore.pass.configuration.halfRes = pass.halfRes;
    aoStore.pass.configuration.aoRadius = pass.aoRadius;
    aoStore.pass.configuration.distanceFalloff = pass.distanceFalloff;
    aoStore.pass.configuration.instensity = pass.instensity;

    switch (pass.qualityMode) {
      case QualityMode.Performance: {
        aoStore.pass.setQualityMode("Performance");
        break;
      }

      case QualityMode.Low: {
        aoStore.pass.setQualityMode("Low");
        break;
      }

      case QualityMode.Medium: {
        aoStore.pass.setQualityMode("Medium");
        break;
      }

      case QualityMode.High: {
        aoStore.pass.setQualityMode("High");
        break;
      }

      case QualityMode.Ultra: {
        aoStore.pass.setQualityMode("Ultra");
        break;
      }
    }

    if (pass.debugMode) {
      aoStore.pass.enableDebugMode();
    } else {
      aoStore.pass.disableDebugMode();
    }
  }
}
