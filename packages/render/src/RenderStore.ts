import {
  BufferGeometry,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from "three";

/**
 * Stores Three.js objects and their associated data.
 */
export class RenderStore {
  renderer: WebGLRenderer = new WebGLRenderer();

  setCanvas(canvas: HTMLCanvasElement) {
    // Dispose old renderer
    this.renderer.dispose();

    // Create new renderer
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  /**
   * Entity ID of the active camera.
   */
  activeCamera: bigint | null = null;

  /**
   * Entity ID of the active scene.
   */
  activeScene: bigint | null = null;

  /**
   * Entity ID -> PerspectiveCamera object.
   */
  readonly perspectiveCameras = new Map<bigint, PerspectiveCamera>();

  /**
   * Entity ID -> Scene object.
   */
  readonly scenes = new Map<bigint, Scene>();

  /**
   * Entity ID -> Geometry object.
   */
  readonly geometries = new Map<bigint, BufferGeometry>();

  /**
   * Entity ID -> Material object.
   */
  readonly materials = new Map<bigint, MeshStandardMaterial>();

  /**
   * Entity ID -> Mesh object.
   */
  readonly meshes = new Map<bigint, Mesh>();

  /**
   * Entity ID -> Object3D.
   */
  readonly nodes = new Map<bigint, Object3D>();
}
