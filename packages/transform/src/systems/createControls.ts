import { RenderStore } from "@houseki-engine/render";
import { SceneStruct } from "@houseki-engine/scene";
import { TransformControls as ThreeTransformControls } from "three/examples/jsm/controls/TransformControls";
import { Entity, Query, Res } from "thyseus";

import { TransformControls } from "../components";
import { CanvasRect, TransformControlsStore } from "../resources";
import { TransformMode } from "../types";

export function createControls(
  renderStore: Res<RenderStore>,
  sceneStruct: Res<SceneStruct>,
  canvasRect: Res<CanvasRect>,
  store: Res<TransformControlsStore>,
  transformControls: Query<[Entity, TransformControls]>
) {
  const ids: bigint[] = [];

  // Update mock element size
  store.mockElement.clientWidth = renderStore.renderer.domElement.clientWidth;
  store.mockElement.clientHeight = renderStore.renderer.domElement.clientHeight;
  store.mockElement.getBoundingClientRect = () => ({
    height: canvasRect.height,
    left: canvasRect.x,
    top: canvasRect.y,
    width: canvasRect.width,
  });

  // Create new objects
  for (const [entity, controls] of transformControls) {
    ids.push(entity.id);

    let object = store.objects.get(entity.id);

    if (!object) {
      const cameraObject = renderStore.perspectiveCameras.get(
        sceneStruct.activeCamera
      );
      if (!cameraObject) continue;

      const sceneObject = renderStore.scenes.get(sceneStruct.activeScene);
      if (!sceneObject) continue;

      object = new ThreeTransformControls(
        cameraObject,
        store.mockElement as any
      );

      sceneObject.add(object);

      store.objects.set(entity.id, object);
    }

    object.enabled = controls.enabled;

    for (const child of object.children) {
      child.visible = controls.enabled;
    }

    switch (controls.mode) {
      case TransformMode.Translate: {
        object.setMode("translate");
        break;
      }

      case TransformMode.Rotate: {
        object.setMode("rotate");
        break;
      }

      case TransformMode.Scale: {
        object.setMode("scale");
        break;
      }
    }

    const targetObject = renderStore.nodes.get(controls.targetId);

    if (targetObject) {
      object.attach(targetObject);
    } else {
      object.detach();
    }
  }

  // Remove objects that no longer exist
  for (const id of store.objects.keys()) {
    if (!ids.includes(id)) {
      const object = store.objects.get(id);
      if (object) {
        object.detach();
        object.removeFromParent();
        object.dispose();
      }

      store.objects.delete(id);
    }
  }
}
