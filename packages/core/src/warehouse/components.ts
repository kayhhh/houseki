import { struct } from "thyseus";

import { Warehouse } from "./Warehouse";

/**
 * A resource is a reference to a data object stored in the warehouse.
 */
@struct
export class Resource<T> {
  @struct.u32 declare id: number;

  read(warehouse: Readonly<Warehouse>) {
    return warehouse.get(this.id) as T | undefined;
  }

  write(data: T, warehouse: Warehouse) {
    if (!this.id) {
      this.id = warehouse.store(data);
    } else {
      warehouse.set(this.id, data);
    }
  }
}
