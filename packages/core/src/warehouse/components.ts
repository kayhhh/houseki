import { struct } from "thyseus";

import { warehouse } from "./Warehouse";

@struct
export class Resource<T> {
  @struct.u32 declare id: number;

  read() {
    return warehouse.get(this.id) as T;
  }

  write(data: T) {
    if (!this.id) this.id = warehouse.store(data);
    else warehouse.set(this.id, data);
  }
}
