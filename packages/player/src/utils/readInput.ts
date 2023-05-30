import { InputStruct, Key } from "@lattice-engine/input";

export type Input = {
  x: number;
  y: number;
};

export function readInput(inputStruct: InputStruct): Input {
  const up =
    inputStruct.keyPressed(Key.w) || inputStruct.keyPressed(Key.ArrowUp);
  const down =
    inputStruct.keyPressed(Key.s) || inputStruct.keyPressed(Key.ArrowDown);
  const left =
    inputStruct.keyPressed(Key.a) || inputStruct.keyPressed(Key.ArrowLeft);
  const right =
    inputStruct.keyPressed(Key.d) || inputStruct.keyPressed(Key.ArrowRight);

  const inputForward = Number(up) - Number(down);
  const inputRight = Number(right) - Number(left);

  const { x, y } = normalize(inputRight, inputForward);

  return { x, y };
}

function normalize(x: number, y: number) {
  const length = Math.sqrt(x * x + y * y);
  if (length === 0) return { x: 0, y: 0 };

  const normalX = x / length;
  const normalY = y / length;

  return { x: normalX, y: normalY };
}
