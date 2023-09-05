declare module "troika-three-text" {
  export class Text {
    text: string;
    fontSize: number;
    anchorX: "left" | "center" | "right";
    anchorY: "top" | "top-baseline" | "middle" | "bottom" | "bottom-baseline";
    color: string;

    dispose(): void;
    removeFromParent(): void;
  }
}
