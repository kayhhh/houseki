/**
 * Used to store data outside of the ECS.
 * Useful for dynamically sized data, which you don't know the size of at compile time.
 * Each item gets a unique ID which can be stored in the ECS.
 * Will not be cleaned up automatically.
 */
export class Warehouse {
  #nextId = 1;
  #map = new Map<number, unknown>();

  store(data: unknown) {
    const id = this.#nextId++;
    this.#map.set(id, data);
    return id;
  }

  get(id: number) {
    return this.#map.get(id);
  }

  set(id: number, data: unknown) {
    this.#map.set(id, data);
  }

  delete(id: number) {
    this.#map.delete(id);
  }

  has(id: number) {
    return this.#map.has(id);
  }

  clear() {
    this.#map.clear();
  }

  get size() {
    return this.#map.size;
  }
}
