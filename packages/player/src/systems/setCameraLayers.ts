import { RenderStore } from "@lattice-engine/render";
import {
  FIRSTPERSON_ONLY_LAYER,
  THIRDPERSON_ONLY_LAYER,
} from "@lattice-engine/vrm";
import { Entity, Query, Res } from "thyseus";

import { PlayerCamera } from "../components";
import { PlayerCameraView } from "../types";

/**
 * Sets the camera layers based on the current view.
 * Used to show/hide different parts of the avatar when in different views.
 */
export function setCameraLayers(
  renderStore: Res<RenderStore>,
  entities: Query<[Entity, PlayerCamera]>,
) {
  for (const [entity, camera] of entities) {
    const object = renderStore.perspectiveCameras.get(entity.id);
    if (!object) continue;

    if (camera.currentView === PlayerCameraView.FirstPerson) {
      object.layers.enable(FIRSTPERSON_ONLY_LAYER);
      object.layers.disable(THIRDPERSON_ONLY_LAYER);
    } else if (camera.currentView === PlayerCameraView.ThirdPerson) {
      object.layers.disable(FIRSTPERSON_ONLY_LAYER);
      object.layers.enable(THIRDPERSON_ONLY_LAYER);
    }
  }
}
