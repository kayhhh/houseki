export enum PointerType {
  mouse = 0,
  pen = 1,
  touch = 2,
}

/**
 * Converts keyboard input -> a number that can be stored in the ECS
 * There is probably a better way to do this lol
 */
export enum Key {
  // 0-9 are the numbers 0-9

  // 10-35 are the letters a-z (lowercase and uppercase)
  a = 10,
  b = 11,
  c = 12,
  d = 13,
  e = 14,
  f = 15,
  g = 16,
  h = 17,
  i = 18,
  j = 19,
  k = 20,
  l = 21,
  m = 22,
  n = 23,
  o = 24,
  p = 25,
  q = 26,
  r = 27,
  s = 28,
  t = 29,
  u = 30,
  v = 31,
  w = 32,
  x = 33,
  y = 34,
  z = 35,

  A = 10,
  B = 11,
  C = 12,
  D = 13,
  E = 14,
  F = 15,
  G = 16,
  H = 17,
  I = 18,
  J = 19,
  K = 20,
  L = 21,
  M = 22,
  N = 23,
  O = 24,
  P = 25,
  Q = 26,
  R = 27,
  S = 28,
  T = 29,
  U = 30,
  V = 31,
  W = 32,
  X = 33,
  Y = 34,
  Z = 35,

  // 62-82 are special keys
  Backspace = 62,
  Tab = 63,
  Enter = 64,
  Shift = 65,
  Control = 66,
  Alt = 67,
  Meta = 68,
  Pause = 69,
  CapsLock = 70,
  Escape = 71,
  Space = 72,
  PageUp = 73,
  PageDown = 74,
  End = 75,
  Home = 76,
  ArrowLeft = 77,
  ArrowUp = 78,
  ArrowRight = 79,
  ArrowDown = 80,
  Insert = 81,
  Delete = 82,

  Undefined = 255, // Unsupported key
}
