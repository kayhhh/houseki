import { JSONDocument } from "@gltf-transform/core";

export type ExportedJSON = {
  json: JSONDocument["json"];
  resources: Record<string, number[]>;
};
