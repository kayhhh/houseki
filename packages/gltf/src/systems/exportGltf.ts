import { JSONDocument, WebIO } from "@gltf-transform/core";
import { dedup, prune } from "@gltf-transform/functions";
import { Asset, Warehouse } from "@lattice-engine/core";
import {
  BoxCollider,
  CapsuleCollider,
  CylinderCollider,
  DynamicBody,
  HullCollider,
  KinematicBody,
  MeshCollider,
  SphereCollider,
  StaticBody,
} from "@lattice-engine/physics";
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
import {
  exportBoxCollider,
  exportCapsuleCollider,
  exportCylinderCollider,
  exportHullCollider,
  exportMeshCollider,
  exportSphereCollider,
} from "../export/exportCollider";
import { exportImage } from "../export/exportImage";
import { exportMaterial } from "../export/exportMaterial";
import { exportMesh } from "../export/exportMesh";
import { exportNode } from "../export/exportNode";
import {
  exportDynamicBody,
  exportKinematicBody,
  exportStaticBody,
} from "../export/exportPhysicsBody";
import { exportScene } from "../export/exportScene";
import { parentNodes } from "../export/parentNodes";
import { extensions } from "../extensions/extensions";
import { ExportedJSON } from "../types";

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
  images: Query<[Entity, Asset], With<Image>>,
  staticBodies: Query<Entity, With<StaticBody>>,
  dynamicBodies: Query<[Entity, DynamicBody]>,
  kinematicBodies: Query<[Entity, KinematicBody]>,
  boxColliders: Query<[Entity, BoxCollider]>,
  sphereColliders: Query<[Entity, SphereCollider]>,
  capsuleColliders: Query<[Entity, CapsuleCollider]>,
  cylinderColliders: Query<[Entity, CylinderCollider]>,
  meshColliders: Query<[Entity, MeshCollider]>,
  hullColliders: Query<[Entity, HullCollider]>
) {
  for (const binary of localStore.outBinary) {
    console.info(`📦 Exported glTF binary (${bytesToDisplay(binary.length)})`);

    const event = outWriter.create();
    event.binary = true;

    const blob = new Blob([binary], { type: "model/gltf-binary" });
    event.uri = URL.createObjectURL(blob);

    localStore.outBinary.shift();
  }

  for (const json of localStore.outJson) {
    console.info("📦 Exported glTF JSON", json);

    const exportedJson: ExportedJSON = { json: json.json, resources: {} };

    for (const [name, data] of Object.entries(json.resources)) {
      exportedJson.resources[name] = Array.from(data);
    }

    const blob = new Blob([JSON.stringify(exportedJson)], {
      type: "application/json",
    });

    const event = outWriter.create();
    event.uri = URL.createObjectURL(blob);

    localStore.outJson.shift();
  }

  if (reader.length === 0) return;

  for (const event of reader) {
    const context = new ExportContext();

    let rootId: bigint | undefined;

    for (const [entity, scene] of scenes) {
      if (entity.id !== event.scene) continue;
      rootId = scene.rootId;
      exportScene(context, scene);
    }

    if (rootId === undefined) {
      console.warn("No scene found to export");
      continue;
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

    for (const entity of staticBodies) {
      exportStaticBody(context, entity.id);
    }

    for (const [entity, dynamicBody] of dynamicBodies) {
      exportDynamicBody(context, entity.id, dynamicBody);
    }

    for (const [entity, kinematicBody] of kinematicBodies) {
      exportKinematicBody(context, entity.id, kinematicBody);
    }

    for (const [entity, boxCollider] of boxColliders) {
      exportBoxCollider(context, entity.id, boxCollider);
    }

    for (const [entity, sphereCollider] of sphereColliders) {
      exportSphereCollider(context, entity.id, sphereCollider);
    }

    for (const [entity, capsuleCollider] of capsuleColliders) {
      exportCapsuleCollider(context, entity.id, capsuleCollider);
    }

    for (const [entity, cylinderCollider] of cylinderColliders) {
      exportCylinderCollider(context, entity.id, cylinderCollider);
    }

    for (const [entity, meshCollider] of meshColliders) {
      exportMeshCollider(context, entity.id, meshCollider);
    }

    for (const [entity, hullCollider] of hullColliders) {
      exportHullCollider(context, entity.id, hullCollider);
    }

    parentNodes(context, rootId);

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

function bytesToDisplay(bytes: number) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}