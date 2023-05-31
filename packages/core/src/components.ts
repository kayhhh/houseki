import { initStruct, struct } from "thyseus";

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

@struct
export class Vec3 {
  @struct.array({ length: 3, type: "f32" }) declare array: Float32Array;

  get x() {
    return this.array[0] as number;
  }

  set x(value: number) {
    this.array[0] = value;
  }

  get y() {
    return this.array[1] as number;
  }

  set y(value: number) {
    this.array[1] = value;
  }

  get z() {
    return this.array[2] as number;
  }

  set z(value: number) {
    this.array[2] = value;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  copy(other: Vec3) {
    this.array.set(other.array);
  }

  fromArray(newValue: Readonly<[number, number, number]>) {
    this.array.set(newValue);
  }

  fromObject(other: { x: number; y: number; z: number }) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
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

  get x() {
    return this.array[0] as number;
  }

  set x(value: number) {
    this.array[0] = value;
  }

  get y() {
    return this.array[1] as number;
  }

  set y(value: number) {
    this.array[1] = value;
  }

  get z() {
    return this.array[2] as number;
  }

  set z(value: number) {
    this.array[2] = value;
  }

  get w() {
    return this.array[3] as number;
  }

  set w(value: number) {
    this.array[3] = value;
  }

  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  copy(other: Vec4) {
    this.array.set(other.array);
  }

  fromArray(newValue: Readonly<[number, number, number, number]>) {
    this.array.set(newValue);
  }

  fromObject(other: { x: number; y: number; z: number; w: number }) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.w = other.w;
  }

  toArray() {
    return [this.x, this.y, this.z, this.w] as [number, number, number, number];
  }

  toObject() {
    return { w: this.w, x: this.x, y: this.y, z: this.z };
  }

  constructor(x = 0, y = 0, z = 0, w = 1) {
    initStruct(this);
    this.set(x, y, z, w);
  }
}
