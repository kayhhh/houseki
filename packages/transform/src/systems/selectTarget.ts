import {
  InputStruct,
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent,
} from "@lattice-engine/input";
import { RenderStore } from "@lattice-engine/render";
import { Scene, SceneStruct } from "@lattice-engine/scene";
import { Object3D, Raycaster, Vector2 } from "three";
import { Entity, EventReader, Mut, Query, Res, SystemRes } from "thyseus";

import { TransformControls } from "../components";
import { CanvasRect, TransformControlsStore } from "../resources";

const vec2 = new Vector2();

class LocalRes {
  readonly raycaster = new Raycaster();

  // Count how much the mouse has moved during the click
  movement = 0;
}

export function selectTarget(
  localRes: SystemRes<LocalRes>,
  sceneStruct: Res<SceneStruct>,
  renderStore: Res<RenderStore>,
  inputStruct: Res<InputStruct>,
  rect: Res<CanvasRect>,
  pointerDown: EventReader<PointerDownEvent>,
  pointerMove: EventReader<PointerMoveEvent>,
  pointerUp: EventReader<PointerUpEvent>,
  scenes: Query<[Entity, Scene]>,
  store: Res<TransformControlsStore>,
  transformControls: Query<[Entity, Mut<TransformControls>]>,
) {
  for (const _ of pointerDown) {
    localRes.movement = 0;
  }

  for (const event of pointerMove) {
    if (!inputStruct.isPointerDown) continue;
    localRes.movement += Math.abs(event.movementX) + Math.abs(event.movementY);
  }

  for (const event of pointerUp) {
    // Only left click
    if (event.button !== 0) continue;

    let dragging = false;

    for (const [entity] of transformControls) {
      const object = store.objects.get(entity.id);
      if (!object) continue;

      if (object.dragging) {
        dragging = true;
        break;
      }
    }

    // Only when not dragging
    if (dragging) continue;

    // Only when not moving mouse too much
    // This is to prevent selecting a target when using things like orbit controls
    if (localRes.movement > 10) continue;

    const camera = renderStore.perspectiveCameras.get(sceneStruct.activeCamera);
    if (!camera) continue;

    // We are looking for nodes, so they will only be in the root
    let rootObject: Object3D | undefined;
    for (const [sceneEnt, scene] of scenes) {
      if (sceneEnt.id === sceneStruct.activeScene) {
        rootObject = renderStore.nodes.get(scene.rootId);
        break;
      }
    }
    if (!rootObject) continue;

    vec2.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    vec2.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    localRes.raycaster.setFromCamera(vec2, camera);

    const intersects = localRes.raycaster.intersectObject(rootObject);

    // Find the first valid object
    let foundId = 0n;

    const meshObjects = Array.from(renderStore.meshes.entries());
    const nodeObjects = Array.from(renderStore.nodes.entries());

    while (intersects.length > 0 && !foundId) {
      const intersect = intersects.shift();
      if (!intersect) continue;

      let potentialNode = intersect.object;

      const foundMesh = meshObjects.find(
        ([_, obj]) => obj === intersect.object,
      );

      if (foundMesh && foundMesh[1].parent) {
        potentialNode = foundMesh[1].parent;
      }

      const foundNode = nodeObjects.find(([_, obj]) => obj === potentialNode);
      if (!foundNode) continue;

      foundId = foundNode[0];
    }

    // Set found target
    for (const [_, controls] of transformControls) {
      controls.targetId = foundId;
    }
  }
}
