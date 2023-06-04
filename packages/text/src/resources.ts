import { Text } from "troika-three-text";

export class TextStore {
  /**
   * Entity ID -> Text object
   */
  readonly textObjects = new Map<bigint, Text>();
}
