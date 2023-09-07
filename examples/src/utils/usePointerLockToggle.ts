import { useControls } from "leva";
import { useEffect } from "react";
import { InputStruct } from "reddo/input";
import { Mut, Res } from "thyseus";

const store = {
  pointerLock: false,
};

export function usePointerLockToggle(value = false) {
  useControls({
    "pointer lock": {
      onChange: (newValue: boolean) => {
        store.pointerLock = newValue;
      },
      value,
    },
  });

  useEffect(() => {
    return () => {
      store.pointerLock = false;
    };
  }, []);
}

export function handlePointerLockToggle(inputStruct: Res<Mut<InputStruct>>) {
  inputStruct.enablePointerLock = store.pointerLock;
}
