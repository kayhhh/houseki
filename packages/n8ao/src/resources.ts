/// <reference types="../n8ao.d.ts" />

import { N8AOPostPass } from "n8ao";

export class N8AOStore {
  readonly pass = new N8AOPostPass();
}
