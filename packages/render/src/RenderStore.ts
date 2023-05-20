import {
  BufferGeometry,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

/**
 * Stores Three.js objects and their associated data.
 */
export class RenderStore {
  renderer = new WebGLRenderer();

  readonly defaultMaterial = new MeshStandardMaterial();

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
