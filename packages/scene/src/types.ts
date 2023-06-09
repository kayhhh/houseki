export enum MaterialAlphaMode {
  OPAQUE = 0,
  MASK = 1,
  BLEND = 2,
}

export enum MeshMode {
  POINTS = 0,
  LINES = 1,
  LINE_LOOP = 2,
  LINE_STRIP = 3,
  TRIANGLES = 4,
  TRIANGLE_STRIP = 5,
  TRIANGLE_FAN = 6,
}

export enum KeyframePath {
  POSITION = 0,
  ROTATION = 1,
  SCALE = 2,
  WEIGHTS = 3,
}

export enum KeyframeInterpolation {
  LINEAR = 0,
  STEP = 1,
  CUBICSPLINE = 2,
}
