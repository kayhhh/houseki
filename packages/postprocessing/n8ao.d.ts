declare module "n8ao" {
  export class N8AOPostPass extends Pass {
    constructor(
      scene?: Scene,
      camera?: Camera,
      width?: number,
      height?: number,
    );

    scene: Scene;
    camera: Camera;

    configuration: {
      halfRes: boolean;
      aoRadius: number;
      distanceFalloff: number;
      instensity: number;
      color: Color;
    };

    setQualityMode(
      mode: "Performance" | "Low" | "Medium" | "High" | "Ultra",
    ): void;

    enableDebugMode(): void;
    disableDebugMode(): void;
    lastTime: number;
  }
}
