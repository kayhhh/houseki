import {
  ExtensionProperty,
  IProperty,
  Mesh,
  Nullable,
  PropertyType,
} from "@gltf-transform/core";

import { EXTENSION_NAME } from "../constants";
import { ColliderType } from "./schemas";

interface ICollider extends IProperty {
  type: ColliderType;
  isTrigger: boolean;
  size: [number, number, number];
  radius: number;
  height: number;
  mesh: Mesh;
}

export class Collider extends ExtensionProperty<ICollider> {
  static override readonly EXTENSION_NAME = EXTENSION_NAME.OMI_collider;
  declare extensionName: typeof EXTENSION_NAME.OMI_collider;
  declare propertyType: "Collider";
  declare parentTypes: [PropertyType.NODE];

  static Type: Record<string, ColliderType> = {
    BOX: "box",
    CAPSULE: "capsule",
    CYLINDER: "cylinder",
    HULL: "hull",
    SPHERE: "sphere",
    TRIMESH: "trimesh",
  };

  protected init() {
    this.extensionName = EXTENSION_NAME.OMI_collider;
    this.propertyType = "Collider";
    this.parentTypes = [PropertyType.NODE];
  }

  protected override getDefaults(): Nullable<ICollider> {
    return Object.assign(super.getDefaults(), {
      height: 2,
      isTrigger: false,
      mesh: null,
      radius: 0.5,
      size: [1, 1, 1],
      type: null,
    });
  }

  getType() {
    return this.get("type");
  }

  setType(type: ColliderType) {
    this.set("type", type);
  }

  getIsTrigger() {
    return this.get("isTrigger");
  }

  setIsTrigger(isTrigger: boolean) {
    this.set("isTrigger", isTrigger);
  }

  getSize() {
    return this.get("size");
  }

  setSize(size: [number, number, number]) {
    this.set("size", size);
  }

  getRadius() {
    return this.get("radius");
  }

  setRadius(radius: number) {
    this.set("radius", radius);
  }

  getHeight() {
    return this.get("height");
  }

  setHeight(height: number) {
    this.set("height", height);
  }

  getMesh(): Mesh | null {
    return this.getRef("mesh");
  }

  setMesh(mesh: Mesh) {
    this.setRef("mesh", mesh);
  }
}
