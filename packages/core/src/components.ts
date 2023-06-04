import { initStruct, struct } from "thyseus";

import { Resource } from "./warehouse";

/**
 * Marks an entity as loading.
 * Useful for displaying a loading screen while the scene is loading.
 */
@struct
export class Loading {
  /**
   * A message to display while loading.
   */
  @struct.string declare message: string;

  constructor(message = "") {
    initStruct(this);

    this.message = message;
  }
}

/**
 * Assets will be fetched by the engine if a URI is provided.
 */
@struct
export class Asset {
  @struct.string declare uri: string;
  @struct.string declare mimeType: string;

  @struct.substruct(Resource) declare data: Resource<ArrayBuffer>;

  constructor(uri = "", mimeType = "") {
    initStruct(this);

    this.uri = uri;
    this.mimeType = mimeType;
  }
}

@struct
export class Vec3 {
  @struct.array({ length: 3, type: "f32" }) declare array: Float32Array;
  @struct.bool declare hasChanged: boolean;

  get x() {
    return this.array[0] as number;
  }

  set x(value: number) {
    this.array[0] = value;
    this.hasChanged = true;
  }

  get y() {
    return this.array[1] as number;
  }

  set y(value: number) {
    this.array[1] = value;
    this.hasChanged = true;
  }

  get z() {
    return this.array[2] as number;
  }

  set z(value: number) {
    this.array[2] = value;
    this.hasChanged = true;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.hasChanged = true;

    return this;
  }

  copy(other: Vec3) {
    this.array.set(other.array);
    this.hasChanged = true;

    return this;
  }

  fromArray(newValue: Readonly<[number, number, number]>) {
    this.array.set(newValue);
    this.hasChanged = true;

    return this;
  }

  fromObject(other: { x: number; y: number; z: number }) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.hasChanged = true;

    return this;
  }

  toArray() {
    return [this.x, this.y, this.z] as [number, number, number];
  }

  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  constructor(x = 0, y = 0, z = 0) {
    initStruct(this);

    this.set(x, y, z);
  }
}

@struct
export class Vec4 {
  @struct.array({ length: 4, type: "f32" }) declare array: Float32Array;
  @struct.bool declare hasChanged: boolean;

  get x() {
    return this.array[0] as number;
  }

  set x(value: number) {
    this.array[0] = value;
    this.hasChanged = true;
  }

  get y() {
    return this.array[1] as number;
  }

  set y(value: number) {
    this.array[1] = value;
    this.hasChanged = true;
  }

  get z() {
    return this.array[2] as number;
  }

  set z(value: number) {
    this.array[2] = value;
    this.hasChanged = true;
  }

  get w() {
    return this.array[3] as number;
  }

  set w(value: number) {
    this.array[3] = value;
    this.hasChanged = true;
  }

  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    this.hasChanged = true;

    return this;
  }

  copy(other: Vec4) {
    this.array.set(other.array);
    this.hasChanged = true;

    return this;
  }

  fromArray(newValue: Readonly<[number, number, number, number]>) {
    this.array.set(newValue);
    this.hasChanged = true;

    return this;
  }

  fromObject(other: { x: number; y: number; z: number; w: number }) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.w = other.w;
    this.hasChanged = true;

    return this;
  }

  toArray() {
    return [this.x, this.y, this.z, this.w] as [number, number, number, number];
  }

  toObject() {
    return { w: this.w, x: this.x, y: this.y, z: this.z };
  }

  constructor(x = 0, y = 0, z = 0, w = 0) {
    initStruct(this);

    this.set(x, y, z, w);
  }
}
