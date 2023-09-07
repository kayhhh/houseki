import { CoreStore } from "@houseki-engine/core";
import { Mut, Res } from "thyseus";

import { CanvasRect } from "../resources";

export function calcRect(
  coreStore: Res<CoreStore>,
  canvasRect: Res<Mut<CanvasRect>>
) {
  const canvas = coreStore.canvas;
  if (!canvas) return;

  // Lmao
  if (Math.random() < 0.99) return;

  const rect = canvas.getBoundingClientRect();

  canvasRect.x = rect.x;
  canvasRect.y = rect.y;
  canvasRect.width = rect.width;
  canvasRect.height = rect.height;
  canvasRect.left = rect.left;
  canvasRect.top = rect.top;
}
