import { struct, type f32 } from "thyseus";

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
  message: string;

  constructor(message = "") {
    this.message = message;
  }
}

/**
 * Assets will be fetched by the engine if a URI is provided.
 */
@struct
export class Asset {
  uri: string;
  mimeType: string;
  data: Resource<ArrayBuffer> = new Resource();

  constructor(uri = "", mimeType = "") {
    this.uri = uri;
    this.mimeType = mimeType;
  }
}

@struct
export class Vec2 {
  x: f32;
  y: f32;

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(other: Vec2) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  fromArray(array: Readonly<[number, number]>) {
    this.x = array[0];
    this.y = array[1];
    return this;
  }

  fromObject(object: { x: number; y: number }) {
    this.x = object.x;
    this.y = object.y;
  }

  toArray() {
    return [this.x, this.y] as [number, number];
  }

  toObject() {
    return { x: this.x, y: this.y };
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

@struct
export class Vec3 {
  x: f32;
  y: f32;
  z: f32;

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  copy(other: Vec3) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  fromArray(newValue: Readonly<[number, number, number]>) {
    this.x = newValue[0];
    this.y = newValue[1];
    this.z = newValue[2];
    return this;
  }

  fromObject(other: { x: number; y: number; z: number }) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  toArray() {
    return [this.x, this.y, this.z] as [number, number, number];
  }

  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

@struct
export class Vec4 {
  x: f32;
  y: f32;
  z: f32;
  w: f32;

  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  copy(other: Vec4) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  fromArray(newValue: Readonly<[number, number, number, number]>) {
    this.x = newValue[0];
    this.y = newValue[1];
    this.z = newValue[2];
    this.w = newValue[3];
    return this;
  }

  fromObject(other: { x: number; y: number; z: number; w: number }) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.w = other.w;
    return this;
  }

  toArray() {
    return [this.x, this.y, this.z, this.w] as [number, number, number, number];
  }

  toObject() {
    return { w: this.w, x: this.x, y: this.y, z: this.z };
  }

  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}
