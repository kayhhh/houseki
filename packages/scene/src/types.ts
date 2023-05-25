export enum MaterialAlphaMode {
  OPAQUE = 0,
  MASK = 1,
  BLEND = 2,
}

export enum ImageMimeType {
  "image/jpeg" = 0,
  "image/png" = 1,
  "image/webp" = 2,
  "image/gif" = 3,
  "image/bmp" = 4,
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
