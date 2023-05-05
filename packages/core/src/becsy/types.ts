// Types that are not exported from Becsy, but we need to use
// Copied from Becsy source code

import { ComponentType, Entity, Type } from "@lastolivegames/becsy";

export type EntityId = number & { __entityIdBrand: symbol };

export type ShapeSpec = { offset: number; mask: number; value: number };

export interface Field<JSType> {
  name: string;
  type: Type<JSType>;
  default: JSType;
  seq: number;
  updateBuffer?(): void;
  clearRef?(final: boolean, targetId?: EntityId, internalIndex?: number): void;
}

export type ComponentStorage = "sparse" | "packed" | "compact";

export interface Component {
  __invalid?: boolean;
}

export class Binding<C extends Component> {
  declare readonlyMaster: C;
  declare writableMaster: C;
  declare readonlyInstance: C;
  declare writableInstance: C;
  declare readonly shapeOffset: number;
  declare readonly shapeMask: number;
  declare readonly shapeValue: number;
  declare readonly refFields: Field<Entity | null>[];
  declare trackedWrites: boolean;
  declare writableEntityId: EntityId;
  declare writableIndex: number;
  declare readonlyEntityId: EntityId;
  declare readonlyIndex: number;
  declare readonly initDefault: (component: any) => void;
  declare readonly init: (component: any, values: any) => void;

  constructor(
    readonly type: ComponentType<C>,
    readonly fields: Field<any>[],
    shapeSpec: ShapeSpec,
    readonly dispatcher: any,
    public capacity: number,
    readonly storage: ComponentStorage,
    readonly elastic: boolean
  ) {}

  resetWritableInstance(entityId: EntityId, index: number): C {
    return this.writableInstance;
  }

  resetReadonlyInstance(entityId: EntityId, index: number): C {
    return this.readonlyInstance;
  }
}
