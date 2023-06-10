import { KHRTextureTransform } from "@gltf-transform/extensions";

import { OMICollider } from "./OMI_collider/OMICollider";
import { OMIPhysicsBody } from "./OMI_physics_body/OMIPhysicsBody";

export const extensions = [KHRTextureTransform, OMICollider, OMIPhysicsBody];
