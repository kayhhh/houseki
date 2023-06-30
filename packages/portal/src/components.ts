import { initStruct, struct } from "thyseus";

@struct
export class PortalMaterial {
  @struct.u64 declare targetId: bigint; // Entity ID of another portal

  @struct.f32 declare renderWidth: number;
  @struct.f32 declare renderHeight: number;

  constructor(renderWidth = 512, renderHeight = 512) {
    initStruct(this);

    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;
  }
}
