import { Vec3 } from "@lattice-engine/core";
import { Quat, Transform } from "@lattice-engine/scene";
import { type f32, struct, type u64 } from "thyseus";

export class OriginalTransform extends Transform { }
export class OriginalTranslation extends Vec3 { }
export class OriginalRotation extends Quat { }

/**
 * A 2D plane that can be used as a portal.
 */
@struct
export class Portal {
  width: f32;
  height: f32;

  constructor(width = 1, height = 2) {
    this.width = width;
    this.height = height;
  }
}

@struct
export class PortalTarget {
  id: u64 = 0n; // Entity ID of another portal
}

@struct
export class PortalMaterial { }

/**
 * Attach to an entity with a {@link Raycast} to move the raycast through portals.
 * The first raycast will hit the portal,
 * this raycast will be used to raycast from the other side of the portal.
 */
@struct
export class PortalRaycast {
  raycastId = 0n; // Entity ID of the Raycast

  /**
   * Whether the raycast is going through a portal.
   */
  active: boolean = false;

  /**
   * Only true on the first frame the raycast is active.
   */
  firstFrame: boolean = false;

  enterPortalId = 0n; // Entity ID of the portal the raycast entered
  exitPortalId = 0n; // Entity ID of the portal the raycast exited
}
