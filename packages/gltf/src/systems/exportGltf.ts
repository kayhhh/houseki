import { JSONDocument, WebIO } from "@gltf-transform/core";
import { dedup, prune } from "@gltf-transform/functions";
import { Asset, Warehouse } from "@lattice-engine/core";
import {
  Geometry,
  Image,
  Material,
  Mesh,
  Parent,
  Scene,
  Transform,
} from "@lattice-engine/scene";
import {
  Entity,
  EventReader,
  EventWriter,
  Query,
  Res,
  SystemRes,
  With,
} from "thyseus";

import { ExportedGltf, ExportGltf } from "../events";
import { ExportContext } from "../export/context";
import { exportImage } from "../export/exportImage";
import { exportMaterial } from "../export/exportMaterial";
import { exportMesh } from "../export/exportMesh";
import { exportNode } from "../export/exportNode";
import { exportScene } from "../export/exportScene";
import { parentNodes } from "../export/parentNodes";
import { extensions } from "../extensions";

class LocalStore {
  readonly outBinary: Uint8Array[] = [];
  readonly outJson: JSONDocument[] = [];
}

export function exportGlb(
  localStore: SystemRes<LocalStore>,
  warehouse: Res<Warehouse>,
  reader: EventReader<ExportGltf>,
  outWriter: EventWriter<ExportedGltf>,
  scenes: Query<[Entity, Scene]>,
  nodes: Query<[Entity, Parent, Transform]>,
  meshes: Query<[Entity, Mesh, Geometry]>,
  materials: Query<[Entity, Material]>,
  images: Query<[Entity, Asset], With<Image>>
) {
  for (const binary of localStore.outBinary) {
    const event = outWriter.create();
    event.binary = true;

    const blob = new Blob([binary], { type: "model/gltf-binary" });
    event.uri = URL.createObjectURL(blob);

    localStore.outBinary.shift();
  }

  for (const json of localStore.outJson) {
    const event = outWriter.create();

    const blob = new Blob([JSON.stringify(json.json)], {
      type: "application/json",
    });
    event.uri = URL.createObjectURL(blob);

    localStore.outJson.shift();
  }

  if (reader.length === 0) return;

  for (const event of reader) {
    const context = new ExportContext();

    for (const [entity, scene] of scenes) {
      if (entity.id !== event.scene) continue;
      exportScene(context, scene);
    }

    for (const [entity, asset] of images) {
      exportImage(context, warehouse, entity.id, asset);
    }

    for (const [entity, material] of materials) {
      exportMaterial(context, entity.id, material);
    }

    for (const [entity, mesh, geometry] of meshes) {
      exportMesh(context, warehouse, entity.id, mesh, geometry);
    }

    for (const [entity, parent, transform] of nodes) {
      exportNode(context, entity.id, parent.id, transform);
    }

    parentNodes(context, event.scene);

    const io = new WebIO().registerExtensions(extensions);

    const isBinary = event.binary;

    context.doc.transform(dedup(), prune({ keepLeaves: true })).then((doc) => {
      if (isBinary) {
        io.writeBinary(doc).then((binary) => localStore.outBinary.push(binary));
      } else {
        io.writeJSON(doc).then((json) => localStore.outJson.push(json));
      }
    });
  }

  reader.clear();
}
