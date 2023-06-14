import {
  ExtensionProperty,
  IProperty,
  Nullable,
  PropertyType,
} from "@gltf-transform/core";

import { EXTENSION_NAME } from "./constants";
import { PhysicsBodyType } from "./schemas";

type Vec9 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export interface IPhysicsBody extends IProperty {
  type: PhysicsBodyType;
  mass: number;
  linearVelocity: [number, number, number];
  angularVelocity: [number, number, number];
  inertiaTensor: Vec9;
}

export class PhysicsBody extends ExtensionProperty<IPhysicsBody> {
  static override readonly EXTENSION_NAME = EXTENSION_NAME;
  declare extensionName: typeof EXTENSION_NAME;
  declare propertyType: "PhysicsBody";
  declare parentTypes: [PropertyType.NODE];

  protected init() {
    this.extensionName = EXTENSION_NAME;
    this.propertyType = "PhysicsBody";
    this.parentTypes = [PropertyType.NODE];
  }

  protected override getDefaults(): Nullable<IPhysicsBody> {
    return Object.assign(super.getDefaults(), {
      angularVelocity: [0, 0, 0],
      inertiaTensor: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      linearVelocity: [0, 0, 0],
      mass: 1,
      type: null,
    });
  }

  getType() {
    return this.get("type");
  }

  setType(type: PhysicsBodyType) {
    this.set("type", type);
  }

  getMass() {
    return this.get("mass");
  }

  setMass(mass: number) {
    this.set("mass", mass);
  }

  getLinearVelocity() {
    return this.get("linearVelocity");
  }

  setLinearVelocity(linearVelocity: [number, number, number]) {
    this.set("linearVelocity", linearVelocity);
  }

  getAngularVelocity() {
    return this.get("angularVelocity");
  }

  setAngularVelocity(angularVelocity: [number, number, number]) {
    this.set("angularVelocity", angularVelocity);
  }

  getInertiaTensor() {
    return this.get("inertiaTensor");
  }

  setInertiaTensor(inertiaTensor: Vec9) {
    this.set("inertiaTensor", inertiaTensor);
  }
}
