import { struct, type u64 } from "thyseus";

@struct
export class ExportGltf {
  /**
   * The scene to export.
   * Can be a {@link Scene} or a {@link SceneView}.
   */
  scene: u64 = 0n;

  binary: boolean = true;
  keepLeaves: boolean = true;
}

@struct
export class ExportedGltf {
  uri: string = "";
  binary: boolean = false;
}
