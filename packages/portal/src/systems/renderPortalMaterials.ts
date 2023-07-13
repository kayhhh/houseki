import { Time } from "@lattice-engine/core";
import { RenderStore } from "@lattice-engine/render";
import { SceneStruct } from "@lattice-engine/scene";
import { ClearPass } from "postprocessing";
import {
  AlwaysDepth,
  Camera,
  DecrementStencilOp,
  DepthModes,
  EqualStencilFunc,
  IncrementStencilOp,
  LessEqualStencilFunc,
  Material,
  Matrix4,
  MeshBasicMaterial,
  NotEqualStencilFunc,
  Object3D,
  PerspectiveCamera,
  Plane,
  Scene,
  StencilFunc,
  StencilOp,
  Vector3,
  Vector4,
} from "three";
import { Entity, Mut, Query, Res, With } from "thyseus";

import { PortalMaterial, PortalTarget } from "../components";
import { traverseMaterials } from "../utils/traverseMaterials";

const cameraPosition = new Vector3();
const exitCamera = new PerspectiveCamera();
const group = new Object3D();

const INCREMENT_STENCIL_MAT = new MeshBasicMaterial();
INCREMENT_STENCIL_MAT.colorWrite = false;
INCREMENT_STENCIL_MAT.depthTest = false;
INCREMENT_STENCIL_MAT.depthWrite = false;
INCREMENT_STENCIL_MAT.stencilFail = IncrementStencilOp;
INCREMENT_STENCIL_MAT.stencilFunc = NotEqualStencilFunc;
INCREMENT_STENCIL_MAT.stencilWrite = true;

const DECREMENT_STENCIL_MAT = new MeshBasicMaterial();
DECREMENT_STENCIL_MAT.colorWrite = false;
DECREMENT_STENCIL_MAT.depthTest = false;
DECREMENT_STENCIL_MAT.depthWrite = false;
DECREMENT_STENCIL_MAT.stencilFail = DecrementStencilOp;
DECREMENT_STENCIL_MAT.stencilFunc = NotEqualStencilFunc;
DECREMENT_STENCIL_MAT.stencilWrite = true;

const DEPTH_MAT = new MeshBasicMaterial();
DEPTH_MAT.colorWrite = false;
DEPTH_MAT.depthFunc = AlwaysDepth;

const materialSettings = new Map<Material, Partial<MatSettings>>();

let store: RenderStore;
let delta: number;

const clearPass = new ClearPass();

function clear(color: boolean, depth: boolean, stencil: boolean) {
  clearPass.setClearFlags(color, depth, stencil);
  clearPass.render(
    store.renderer,
    store.composer.inputBuffer,
    store.composer.outputBuffer,
    delta
  );
}

type MatSettings = {
  stencilRef: number;
  stencilWrite: boolean;
  stencilWriteMask: number;
  stencilFunc: StencilFunc;
  stencilFail: StencilOp;
  stencilZFail: StencilOp;
  stencilZPass: StencilOp;
  colorWrite: boolean;
  depthWrite: boolean;
  depthFunc: DepthModes;
  depthTest: boolean;
};

type Portal = [entranceObj: Object3D, exitObj: Object3D];

export function renderPortalMaterials(
  time: Res<Time>,
  renderStore: Res<Mut<RenderStore>>,
  sceneStruct: Res<SceneStruct>,
  portalTargets: Query<[Entity, PortalTarget], With<PortalMaterial>>
) {
  const camera = renderStore.perspectiveCameras.get(sceneStruct.activeCamera);
  if (!camera) return;

  const scene = renderStore.scenes.get(sceneStruct.activeScene);
  if (!scene) return;

  store = renderStore;
  delta = time.mainDelta;

  renderStore.renderer.localClippingEnabled = true;
  renderStore.renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows
  renderStore.renderer.autoClear = false;

  clear(true, true, true);

  camera.getWorldPosition(cameraPosition);
  camera.updateMatrixWorld(true);
  camera.matrixAutoUpdate = false;

  const portals: Portal[] = [];

  for (const [entity, portalTarget] of portalTargets) {
    const entrance = renderStore.nodes.get(entity.id);
    if (!entrance) continue;

    const exit = renderStore.nodes.get(portalTarget.id);
    if (!exit) continue;

    entrance.updateMatrixWorld(true);

    portals.push([entrance, exit]);
  }

  const recursionDepth = 0;

  for (const [entrance, exit] of portals) {
    // 1. Increment stencil buffer
    INCREMENT_STENCIL_MAT.stencilRef = recursionDepth;
    render(scene, camera, entrance, INCREMENT_STENCIL_MAT);

    // 2. Render scene from portal exit, with incremented stencil buffer as mask
    exitCamera.copy(camera);
    exitCamera.layers.enableAll();
    computeViewMatrix(exitCamera, camera, entrance, exit);
    computeProjectionMatrix(exitCamera, exit);

    traverseMaterials(scene, (mat) => {
      materialSettings.set(mat, {
        stencilFunc: mat.stencilFunc,
        stencilRef: mat.stencilRef,
        stencilWrite: mat.stencilWrite,
        stencilWriteMask: mat.stencilWriteMask,
      });
      mat.stencilFunc = EqualStencilFunc;
      mat.stencilRef = recursionDepth + 1;
      mat.stencilWrite = true;
      mat.stencilWriteMask = 0x00;
    });

    clear(false, true, false);
    render(scene, exitCamera);

    traverseMaterials(scene, (mat) => {
      const settings = materialSettings.get(mat);
      if (settings?.stencilFunc !== undefined) {
        mat.stencilFunc = settings.stencilFunc;
      }
      if (settings?.stencilRef !== undefined) {
        mat.stencilRef = settings.stencilRef;
      }
      if (settings?.stencilWrite !== undefined) {
        mat.stencilWrite = settings.stencilWrite;
      }
      if (settings?.stencilWriteMask !== undefined) {
        mat.stencilWriteMask = settings.stencilWriteMask;
      }
    });

    // 3. Decrement stencil buffer
    DECREMENT_STENCIL_MAT.stencilRef = recursionDepth + 1;
    render(scene, camera, entrance, DECREMENT_STENCIL_MAT);
  }

  // 4. Render portals into depth buffer
  group.clear();
  for (const [entrance] of portals) {
    group.add(entrance);
  }

  clear(false, true, false);
  render(scene, camera, group, DEPTH_MAT);

  // 5. Prepare for normal scene rendering
  traverseMaterials(scene, (mat) => {
    mat.stencilFunc = LessEqualStencilFunc;
    mat.stencilRef = recursionDepth;
    mat.stencilWrite = true;
    mat.stencilWriteMask = 0x00;
  });

  camera.matrixAutoUpdate = true;
  renderStore.renderer.shadowMap.autoUpdate = true;

  materialSettings.clear();
}

function render(
  scene: Scene,
  camera: PerspectiveCamera,
  objects: Object3D | Object3D[] | null = null,
  overrideMaterial: Material | null = null,
  renderToScreen = false
) {
  const finalPass = store.composer.passes[store.composer.passes.length - 1];
  if (!finalPass) return;

  const ogRenderToScreen = finalPass.renderToScreen;
  const ogChildren = scene.children;

  if (objects) {
    if (Array.isArray(objects)) {
      scene.children = objects;
    } else {
      scene.children = [objects];
    }
  }

  finalPass.renderToScreen = renderToScreen;
  scene.overrideMaterial = overrideMaterial;

  store.composer.setMainCamera(camera);
  store.composer.setMainScene(scene);
  store.composer.render(delta);

  finalPass.renderToScreen = ogRenderToScreen;
  scene.children = ogChildren;
  scene.overrideMaterial = null;
}

const mat4_a = new Matrix4();
const mat4_b = new Matrix4();
const Y_ROTATE = new Matrix4().makeRotationY(Math.PI);

function computeViewMatrix(
  targetCam: Camera,
  sourceCam: Camera,
  entrance: Object3D,
  exit: Object3D
) {
  // Entrance -> Camera
  mat4_a.multiplyMatrices(sourceCam.matrixWorldInverse, entrance.matrixWorld);

  // Entrance -> Exit
  targetCam.matrixWorldInverse
    .identity()
    .multiply(mat4_a)
    .multiply(Y_ROTATE)
    .multiply(mat4_b.copy(exit.matrixWorld).invert());

  targetCam.matrixWorld.copy(targetCam.matrixWorldInverse).invert();
}

const vec3_a = new Vector3();
const vec3_b = new Vector3();
const vec4_a = new Vector4();
const vec4_b = new Vector4();
const clip_plane = new Plane();

type Vec16 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

/**
 * Set near clip plane to the exit portal
 */
function computeProjectionMatrix(targetCam: PerspectiveCamera, exit: Object3D) {
  const inverseView = mat4_a.copy(targetCam.matrixWorld).invert();
  const exitRotation = mat4_b.extractRotation(exit.matrixWorld);
  const normal = vec3_a.set(0, 0, 1).applyMatrix4(exitRotation);

  clip_plane.setFromNormalAndCoplanarPoint(
    normal,
    exit.getWorldPosition(vec3_b)
  );
  clip_plane.applyMatrix4(inverseView);

  const clipVector = vec4_a.set(
    clip_plane.normal.x,
    clip_plane.normal.y,
    clip_plane.normal.z,
    clip_plane.constant
  );

  const elements = targetCam.projectionMatrix.elements as Vec16;

  vec4_b.x = (Math.sign(clipVector.x) + elements[8]) / elements[0];
  vec4_b.y = (Math.sign(clipVector.y) + elements[9]) / elements[5];
  vec4_b.z = -1.0;
  vec4_b.w = (1.0 + elements[10]) / elements[14];

  clipVector.multiplyScalar(2 / clipVector.dot(vec4_b));

  elements[2] = clipVector.x;
  elements[6] = clipVector.y;
  elements[10] = clipVector.z + 1.0;
  elements[14] = clipVector.w;
}
