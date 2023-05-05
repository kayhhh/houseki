import { Type } from "@lastolivegames/becsy";

import { Binding, Component, Field } from "./types";

/**
 * A custom component type for storing a Uint8Array.
 */
export class Uint8ArrayType extends Type<Uint8Array> {
  readonly #maxLength: number;
  readonly #lengthsStride: number;
  readonly #bytesStride: number;

  constructor(maxLength: number) {
    super(new Uint8Array(0));
    this.#maxLength = maxLength;
    this.#lengthsStride = maxLength + Uint16Array.BYTES_PER_ELEMENT;
    this.#bytesStride = this.#lengthsStride * 2;
  }

  override defineElastic<T extends Component>(
    binding: Binding<T>,
    field: Field<Uint8Array>
  ) {
    const bufferKey = `component.${binding.type.id}.field.${field.seq}`;
    let lengths: Uint16Array; // Stores the length of the byte array in the first 2 bytes
    let bytes: Uint8Array;
    const maxLength = this.#maxLength;
    const lengthsStride = this.#lengthsStride;
    const bytesStride = this.#bytesStride;

    field.updateBuffer = () => {
      const size =
        binding.capacity * (maxLength + Uint16Array.BYTES_PER_ELEMENT);
      binding.dispatcher.buffers.register(
        bufferKey,
        size,
        Uint8Array,
        (newData: Uint8Array) => {
          bytes = newData;
          lengths = new Uint16Array(bytes.buffer);
        }
      );
    };
    field.updateBuffer();

    Object.defineProperty(binding.writableMaster, field.name, {
      configurable: true,
      enumerable: true,

      get(this: T): Uint8Array {
        const length = lengths[binding.writableIndex * lengthsStride];
        return new Uint8Array(
          bytes.buffer,
          binding.writableIndex * bytesStride + Uint16Array.BYTES_PER_ELEMENT,
          length
        );
      },

      set(this: T, value: Uint8Array): void {
        lengths[binding.writableIndex * lengthsStride] = value.byteLength;
        bytes.set(
          new Uint8Array(value),
          binding.writableIndex * bytesStride + Uint16Array.BYTES_PER_ELEMENT
        );
      },
    });

    Object.defineProperty(binding.readonlyMaster, field.name, {
      configurable: true,
      enumerable: true,

      get(this: T): Uint8Array {
        const length = lengths[binding.readonlyIndex * lengthsStride];
        return new Uint8Array(
          bytes.buffer,
          binding.readonlyIndex * bytesStride + Uint16Array.BYTES_PER_ELEMENT,
          length
        );
      },

      set(this: T, value: Uint8Array): void {
        throw new Error(
          `Component is not writable; ` +
            `use entity.write(${binding.type.name}) to acquire a writable version`
        );
      },
    });
  }

  override defineFixed<T extends Component>(
    binding: Binding<T>,
    field: Field<string>
  ): void {
    const bufferKey = `component.${binding.type.id}.field.${field.seq}`;
    const lengthsStride = this.#lengthsStride;
    const bytesStride = this.#bytesStride;
    const size =
      binding.capacity * (this.#maxLength + Uint16Array.BYTES_PER_ELEMENT);
    const bytes = binding.dispatcher.buffers.register(
      bufferKey,
      size,
      Uint8Array
    );
    const lengths = new Uint16Array(bytes.buffer); // Stores the length of the byte array in the first 2 bytes

    Object.defineProperty(binding.writableMaster, field.name, {
      configurable: true,
      enumerable: true,

      get(this: T): Uint8Array {
        const length = lengths[binding.writableIndex * lengthsStride];
        return new Uint8Array(
          bytes.buffer,
          binding.writableIndex * bytesStride + Uint16Array.BYTES_PER_ELEMENT,
          length
        );
      },

      set(this: T, value: Uint8Array): void {
        lengths[binding.writableIndex * lengthsStride] = value.byteLength;
        bytes.set(
          new Uint8Array(value),
          binding.writableIndex * bytesStride + Uint16Array.BYTES_PER_ELEMENT
        );
      },
    });

    Object.defineProperty(binding.readonlyMaster, field.name, {
      configurable: true,
      enumerable: true,

      get(this: T): Uint8Array {
        const length = lengths[binding.readonlyIndex * lengthsStride];
        return new Uint8Array(
          bytes.buffer,
          binding.readonlyIndex * bytesStride + Uint16Array.BYTES_PER_ELEMENT,
          length
        );
      },

      set(this: T, value: Uint8Array): void {
        throw new Error(
          `Component is not writable; ` +
            `use entity.write(${binding.type.name}) to acquire a writable version`
        );
      },
    });
  }
}
