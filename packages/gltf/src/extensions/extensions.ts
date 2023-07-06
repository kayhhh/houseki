import {
  KHRDracoMeshCompression,
  KHRTextureTransform,
  KHRXMP,
} from "@gltf-transform/extensions";

import { MOZText } from "./MOZ_text/MOZText";
import { OMICollider } from "./OMI_collider/OMICollider";
import { OMIPhysicsBody } from "./OMI_physics_body/OMIPhysicsBody";

export const extensions = [
  KHRDracoMeshCompression,
  KHRTextureTransform,
  KHRXMP,
  MOZText,
  OMICollider,
  OMIPhysicsBody,
];
