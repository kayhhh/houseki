declare module "troika-three-text" {
  export class Text extends Object3D {
    text: string;
    fontSize: number;
    anchorX: "left" | "center" | "right";
    anchorY: "top" | "top-baseline" | "middle" | "bottom" | "bottom-baseline";

    dispose(): void;
    removeFromParent(): void;
  }
}
