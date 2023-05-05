import { Uint8ArrayType } from "./Uint8ArrayType";

/**
 * Helper class for using custom component types.
 */
export class CustomType {
  static Uint8Array = (maxByteLength: number) =>
    new Uint8ArrayType(maxByteLength);
}
