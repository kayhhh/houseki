import {
  Document,
  Material,
  Mesh,
  Node,
  Scene,
  Texture,
} from "@gltf-transform/core";

export class ExportContext {
  doc = new Document();

  defaultScene: Scene;
  defaultSceneId: bigint = 0n;

  scenes = new Map<bigint, Scene>();

  /**
   * Entity ID -> Texture
   */
  textures = new Map<bigint, Texture>();

  /**
   * Entity ID -> Material
   */
  materials = new Map<bigint, Material>();

  /**
   * Entity ID -> Mesh
   */
  meshes = new Map<bigint, Mesh>();

  /**
   * Entity ID -> Node
   */
  nodes = new Map<bigint, Node>();

  /**
   * Entity ID -> Parent ID
   */
  parents = new Map<bigint, bigint>();

  /**
   * Entity ID -> Name
   */
  names = new Map<bigint, string>();

  constructor() {
    this.defaultScene = this.doc.createScene();
    this.doc.getRoot().setDefaultScene(this.defaultScene);

    this.doc.createBuffer();
  }
}
