import { initStruct, struct } from "thyseus";

/**
 * Marks an entity as loading.
 * Useful for displaying a loading screen while the scene is loading.
 */
@struct
export class Loading {
  /**
   * A message to display while loading.
   */
  @struct.string declare message: string;

  constructor(message = "") {
    initStruct(this);

    this.message = message;
  }
}
