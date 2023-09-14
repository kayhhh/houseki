import {
  ExtensionProperty,
  IProperty,
  Mesh,
  Nullable,
  PropertyType,
} from "@gltf-transform/core";

import { EXTENSION_NAME } from "./constants";
import { ShapeType } from "./schemas";

interface IShape extends IProperty {
  type: ShapeType;
  size: [number, number, number];
  radius: number;
  height: number;
  mesh: Mesh;
  isTrigger: boolean;
}

export class Shape extends ExtensionProperty<IShape> {
  static override readonly EXTENSION_NAME = EXTENSION_NAME;
  declare extensionName: typeof EXTENSION_NAME;
  declare propertyType: "Collider";
  declare parentTypes: [PropertyType.NODE];

  static Type: Record<string, ShapeType> = {
    BOX: "box",
    CAPSULE: "capsule",
    CONVEX: "convex",
    CYLINDER: "cylinder",
    SPHERE: "sphere",
    TRIMESH: "trimesh",
  };

  protected init() {
    this.extensionName = EXTENSION_NAME;
    this.propertyType = "Collider";
    this.parentTypes = [PropertyType.NODE];
  }

  protected override getDefaults(): Nullable<IShape> {
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

  setType(type: ShapeType) {
    this.set("type", type);
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

  getIsTrigger() {
    return this.get("isTrigger");
  }

  setIsTrigger(isTrigger: boolean) {
    this.set("isTrigger", isTrigger);
  }
}
