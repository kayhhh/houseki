import { Raycast } from "@lattice-engine/physics";
import { initStruct, struct } from "thyseus";

/**
 * A 2D plane that can be used as a portal.
 */
@struct
export class Portal {
  @struct.f32 declare width: number;
  @struct.f32 declare height: number;

  constructor(width = 1, height = 2) {
    initStruct(this);

    this.width = width;
    this.height = height;
  }
}

@struct
export class PortalTarget {
  @struct.u64 declare id: bigint; // Entity ID of another portal
}

@struct
export class PortalMaterial {
  @struct.f32 declare renderWidth: number;
  @struct.f32 declare renderHeight: number;

  constructor(renderWidth = 512, renderHeight = 512) {
    initStruct(this);

    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;
  }
}

/**
 * Attach to an entity with a {@link Raycast} to move the raycast through portals.
 * The first raycast will hit the portal,
 * this raycast will be used to raycast from the other side of the portal.
 */
export class PortalRaycast extends Raycast {}
