import { RenderStore } from "@houseki-engine/render";
import { SceneStruct } from "@houseki-engine/scene";
import { Vector3 } from "three";
import { CSM } from "three/examples/jsm/csm/CSM";
import { Entity, Mut, Query, Res } from "thyseus";

import { CascadingShadowMaps } from "../components";
import { CSMStore } from "../resources";

const vec3 = new Vector3(0.2, -1, 0.4).normalize();

export function createCSM(
  csmStore: Res<Mut<CSMStore>>,
  renderStore: Res<RenderStore>,
  sceneStruct: Res<SceneStruct>,
  entities: Query<[Entity, CascadingShadowMaps]>
) {
  const ids: bigint[] = [];

  for (const [entity, csm] of entities) {
    ids.push(entity.id);

    let object = csmStore.objects.get(entity.id);

    const scene = renderStore.scenes.get(sceneStruct.activeScene);

    const camera = renderStore.perspectiveCameras.get(entity.id);

    if (!object) {
      object = new CSM({
        camera,
        cascades: csm.cascades,
        lightDirection: vec3,
        lightIntensity: csm.lightIntensity / csm.cascades,
        maxFar: csm.far,
        parent: scene,
        shadowBias: csm.shadowBias,
        shadowMapSize: csm.shadowMapSize,
      });
      csmStore.objects.set(entity.id, object);
    }

    if (camera) object.camera = camera;
    if (scene) object.parent = scene;

    object.cascades = csm.cascades;
    object.lightIntensity = csm.lightIntensity / csm.cascades;
    object.shadowMapSize = csm.shadowMapSize;
    object.shadowBias = csm.shadowBias;
    object.maxFar = csm.far;
    object.fade = csm.fade;
  }

  // Remove objects that are no longer in the query
  for (const [id] of csmStore.objects) {
    if (!ids.includes(id)) {
      const object = csmStore.objects.get(id);
      if (object) object.dispose();

      csmStore.objects.delete(id);
    }
  }
}
