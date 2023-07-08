import {
  KHRDracoMeshCompression,
  KHRTextureTransform,
  KHRXMP,
} from "@gltf-transform/extensions";

import { MOZText } from "./MOZ_text/MOZText";
import { OMIPhysicsBody } from "./OMI_physics_body/OMIPhysicsBody";
import { OMIPhysicsShape } from "./OMI_physics_shape/OMIPhysicsShape";

export const extensions = [
  KHRDracoMeshCompression,
  KHRTextureTransform,
  KHRXMP,
  MOZText,
  OMIPhysicsShape,
  OMIPhysicsBody,
];
