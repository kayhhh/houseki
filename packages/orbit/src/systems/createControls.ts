import { RenderStore } from "@reddo/render";
import { PerspectiveCamera, Transform } from "@reddo/scene";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { OrbitControls } from "../components";
import { OrbitControlsStore } from "../resources";

export function createControls(
  renderStore: Res<RenderStore>,
  store: Res<Mut<OrbitControlsStore>>,
  entities: Query<
    [Entity, Mut<Transform>],
    With<[OrbitControls, PerspectiveCamera]>
  >
) {
  const ids: bigint[] = [];

  // Update mock element size
  store.mockElement.clientWidth = renderStore.renderer.domElement.clientWidth;
  store.mockElement.clientHeight = renderStore.renderer.domElement.clientHeight;

  // Create new objects
  for (const [entity] of entities) {
    ids.push(entity.id);

    if (store.objects.has(entity.id)) continue;

    const cameraObject = renderStore.perspectiveCameras.get(entity.id);
    if (!cameraObject) continue;

    const object = new ThreeOrbitControls(
      cameraObject,
      store.mockElement as any
    );
    object.enableDamping = true;

    store.objects.set(entity.id, object);
  }

  // Remove objects that no longer exist
  for (const id of store.objects.keys()) {
    if (!ids.includes(id)) {
      const object = store.objects.get(id);
      if (object) object.dispose();

      store.objects.delete(id);
    }
  }
}
