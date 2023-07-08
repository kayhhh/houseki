import { RenderStore } from "@lattice-engine/render";
import { SceneStruct } from "@lattice-engine/scene";
import { N8AOPostPass } from "n8ao";
import { Mut, Query, Res } from "thyseus";

import { N8AOPass } from "../components";
import { N8aoRes } from "../resources";
import { N8QualityMode } from "../types";

export function createN8aoPass(
  sceneStruct: Res<SceneStruct>,
  renderStore: Res<RenderStore>,
  res: Res<Mut<N8aoRes>>,
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

    let n8ao = res.pass;

    if (!n8ao) {
      n8ao = new N8AOPostPass();
      res.pass = n8ao;
    }

    n8ao.camera = camera;
    n8ao.scene = scene;

    n8ao.configuration.halfRes = pass.halfRes;
    n8ao.configuration.aoRadius = pass.aoRadius;
    n8ao.configuration.distanceFalloff = pass.distanceFalloff;
    n8ao.configuration.instensity = pass.instensity;

    switch (pass.qualityMode) {
      case N8QualityMode.Performance: {
        n8ao.setQualityMode("Performance");
        break;
      }

      case N8QualityMode.Low: {
        n8ao.setQualityMode("Low");
        break;
      }

      case N8QualityMode.Medium: {
        n8ao.setQualityMode("Medium");
        break;
      }

      case N8QualityMode.High: {
        n8ao.setQualityMode("High");
        break;
      }

      case N8QualityMode.Ultra: {
        n8ao.setQualityMode("Ultra");
        break;
      }
    }

    if (pass.debugMode) {
      n8ao.enableDebugMode();
    } else {
      n8ao.disableDebugMode();
    }
  }
}
