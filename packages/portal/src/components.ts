import { Vec3 } from "@lattice-engine/core";
import { Quat, Transform } from "@lattice-engine/scene";
import { initStruct, struct } from "thyseus";

export class OriginalTransform extends Transform {}
export class OriginalTranslation extends Vec3 {}
export class OriginalRotation extends Quat {}

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
export class PortalMaterial {}

/**
 * Attach to an entity with a {@link Raycast} to move the raycast through portals.
 * The first raycast will hit the portal,
 * this raycast will be used to raycast from the other side of the portal.
 */
@struct
export class PortalRaycast {
  @struct.u64 declare raycastId: bigint; // Entity ID of the Raycast

  /**
   * Whether the raycast is going through a portal.
   */
  @struct.bool declare active: boolean;

  /**
   * Only true on the first frame the raycast is active.
   */
  @struct.bool declare firstFrame: boolean;

  @struct.u64 declare enterPortalId: bigint; // Entity ID of the portal the raycast entered
  @struct.u64 declare exitPortalId: bigint; // Entity ID of the portal the raycast exited
}
