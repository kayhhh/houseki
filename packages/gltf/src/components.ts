import { component, field } from "@lastolivegames/becsy";

/**
 * A URI pointing to a glTF file.
 * Add to an entity to load the glTF into the ECS.
 */
@component
export class GltfUri {
  @field.dynamicString(256) declare uri: string;
}

/**
 * A glb file.
 * Add to an entity to load the glb into the ECS.
 */
@component
export class GltfBinary {
  @field.object declare data: Uint8Array;
}
