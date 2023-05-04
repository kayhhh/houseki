import { component, Entity, field } from "@lastolivegames/becsy";

/**
 * A URI of a resource to load into the ECS.
 * Add to an entity to load the resource.
 */
@component
export class ResourceUri {
  @field.dynamicString(256) declare uri: string;
}

/**
 * A pointer to the ResourceData for a resource.
 * Will be added to an entity when it's ResourceUri is loaded.
 */
@component
export class ResourcePointer {
  @field.ref declare data: Entity;
}

/**
 * The raw data of a loaded resource.
 * Only one ResourceData will exist for a given URI.
 */
@component
export class ResourceData {
  @field.backrefs(ResourcePointer, "data") declare pointers: Entity[];
}
