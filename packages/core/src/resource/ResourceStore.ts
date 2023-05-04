import { TypedArray } from "./types";

/**
 * Stores raw ArrayBuffer and TypedArray data.
 * There is no good way to store this data in the ECS, so we store it here instead.
 */
export class ResourceStore {
  #nextId = 1;
  #map = new Map<number, ArrayBuffer | TypedArray>();

  /**
   * Stores the given data and returns an ID that can be used to retrieve it later.
   */
  store(data: ArrayBuffer | TypedArray) {
    const id = this.#nextId++;
    this.#map.set(id, data);
    return id;
  }

  get(id: number) {
    return this.#map.get(id);
  }

  delete(id: number) {
    this.#map.delete(id);
  }

  clear() {
    this.#map.clear();
  }
}

export const resourceStore = new ResourceStore();
