/// <reference types="../n8ao.d.ts" />

import { N8AOPostPass } from "n8ao";
import { OutlineEffect } from "postprocessing";

export class OutlineRes {
  effect: OutlineEffect | null = null;
  hasChanged = false;
}

export class N8aoRes {
  pass: N8AOPostPass | null = null;
}
