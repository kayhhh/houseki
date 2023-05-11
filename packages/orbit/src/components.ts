import { struct } from "thyseus";

/**
 * Marks an entity as having OrbitControls.
 * Entity must also have a PerspectiveCamera, which will be used as the target.
 */
@struct
export class IsOrbitControls {}
