import {
  BoxCollider,
  CapsuleCollider,
  CylinderCollider,
  HullCollider,
  MeshCollider,
  SphereCollider,
} from "@houseki-engine/physics";

import { OMIPhysicsShape } from "../extensions/OMI_physics_shape/OMIPhysicsShape";
import { ExportContext } from "./context";

export function exportBoxCollider(
  context: ExportContext,
  entityId: bigint,
  collider: BoxCollider
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const property = extension.createShape();

  property.setType("box");
  property.setSize(collider.size.toArray());

  node.setExtension(property.extensionName, property);
}

export function exportSphereCollider(
  context: ExportContext,
  entityId: bigint,
  collider: SphereCollider
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const property = extension.createShape();

  property.setType("sphere");
  property.setRadius(collider.radius);

  node.setExtension(property.extensionName, property);
}

export function exportCapsuleCollider(
  context: ExportContext,
  entityId: bigint,
  collider: CapsuleCollider
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const property = extension.createShape();

  property.setType("capsule");
  property.setRadius(collider.radius);
  property.setHeight(collider.height);

  node.setExtension(property.extensionName, property);
}

export function exportCylinderCollider(
  context: ExportContext,
  entityId: bigint,
  collider: CylinderCollider
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const property = extension.createShape();

  property.setType("cylinder");
  property.setRadius(collider.radius);
  property.setHeight(collider.height);

  node.setExtension(property.extensionName, property);
}

export function exportHullCollider(
  context: ExportContext,
  entityId: bigint,
  collider: HullCollider
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const meshId = collider.meshId || entityId;
  const mesh = context.meshes.get(meshId);
  if (!mesh) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const property = extension.createShape();

  property.setType("convex");
  property.setMesh(mesh);

  node.setExtension(property.extensionName, property);
}

export function exportMeshCollider(
  context: ExportContext,
  entityId: bigint,
  collider: MeshCollider
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const meshId = collider.meshId || entityId;
  const mesh = context.meshes.get(meshId);
  if (!mesh) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const property = extension.createShape();

  property.setType("trimesh");
  property.setMesh(mesh);

  node.setExtension(property.extensionName, property);
}
