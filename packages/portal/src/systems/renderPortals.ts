import { RenderStore } from "@lattice-engine/render";
import { SceneStruct } from "@lattice-engine/scene";
import { PerspectiveCamera, Vector3 } from "three";
import { frameCorners } from "three/examples/jsm/utils/CameraUtils";
import { Entity, Mut, Query, Res } from "thyseus";

import { PortalMaterial } from "../components";
import { PortalStore } from "../resources";

const reflected = new Vector3();
const bottomLeft = new Vector3();
const bottomRight = new Vector3();
const topLeft = new Vector3();
const portalCamera = new PerspectiveCamera();

export function renderPortals(
  renderStore: Res<Mut<RenderStore>>,
  portalStore: Res<PortalStore>,
  sceneStruct: Res<SceneStruct>,
  portals: Query<[Entity, PortalMaterial]>,
) {
  const camera = renderStore.perspectiveCameras.get(sceneStruct.activeCamera);
  if (!camera) return;

  const scene = renderStore.scenes.get(sceneStruct.activeScene);
  if (!scene) return;

  portalCamera.fov = camera.fov;
  portalCamera.near = camera.near;
  portalCamera.far = camera.far;

  // Avoid re-computing shadows
  renderStore.renderer.localClippingEnabled = true;
  renderStore.renderer.shadowMap.autoUpdate = false;
  renderStore.renderer.autoClear = false;

  for (const [entity, portal] of portals) {
    const object = renderStore.nodes.get(entity.id);
    if (!object) continue;

    const renderTarget = portalStore.renderTargets.get(entity.id);
    if (!renderTarget) continue;

    const target = renderStore.nodes.get(portal.targetId);
    if (!target) continue;

    const targetMesh = renderStore.meshes.get(portal.targetId);
    if (!targetMesh) continue;

    portalCamera.aspect = portal.renderWidth / portal.renderHeight;
    portalCamera.updateProjectionMatrix();

    // Set the portal camera position to be reflected across the portal
    object.worldToLocal(reflected.copy(camera.position));
    reflected.x *= -1;
    reflected.z *= -1;
    target.localToWorld(reflected);
    portalCamera.position.copy(reflected);

    // Grab the corners of the target portal
    targetMesh.geometry.computeBoundingBox();
    if (!targetMesh.geometry.boundingBox) continue;

    bottomLeft.copy(targetMesh.geometry.boundingBox.min);

    bottomRight.set(
      targetMesh.geometry.boundingBox.max.x,
      targetMesh.geometry.boundingBox.min.y,
      targetMesh.geometry.boundingBox.min.z,
    );

    topLeft.set(
      targetMesh.geometry.boundingBox.min.x,
      targetMesh.geometry.boundingBox.max.y,
      targetMesh.geometry.boundingBox.min.z,
    );

    bottomLeft.x *= -1;
    bottomRight.x *= -1;
    topLeft.x *= -1;

    target.localToWorld(bottomLeft);
    target.localToWorld(bottomRight);
    target.localToWorld(topLeft);

    // Set the projection matrix to encompass the corners of the target portal
    frameCorners(portalCamera, bottomLeft, bottomRight, topLeft, false);

    // Render the scene to the portal render target
    renderTarget.texture.colorSpace = renderStore.renderer.outputColorSpace;
    renderStore.renderer.setRenderTarget(renderTarget);
    renderStore.renderer.state.buffers.depth.setMask(true);
    if (renderStore.renderer.autoClear === false) renderStore.renderer.clear();

    object.visible = false;
    renderStore.renderer.render(scene, portalCamera);
    object.visible = true;
  }

  // Reset the renderer
  renderStore.renderer.setRenderTarget(null);
  renderStore.renderer.shadowMap.autoUpdate = true;
}
