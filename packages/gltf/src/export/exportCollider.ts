import {
  BoxCollider,
  CapsuleCollider,
  CylinderCollider,
  HullCollider,
  MeshCollider,
  SphereCollider,
} from "@lattice-engine/physics";

import { OMIPhysicsShape } from "../extensions/OMI_physics_shape/OMIPhysicsShape";
import { ExportContext } from "./context";

export function exportBoxCollider(
  context: ExportContext,
  entityId: bigint,
  collider: BoxCollider,
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const physicsBody = extension.createShape();

  physicsBody.setType("box");
  physicsBody.setSize(collider.size.toArray());

  node.setExtension(OMIPhysicsShape.EXTENSION_NAME, physicsBody);
}

export function exportSphereCollider(
  context: ExportContext,
  entityId: bigint,
  collider: SphereCollider,
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const physicsBody = extension.createShape();

  physicsBody.setType("sphere");
  physicsBody.setRadius(collider.radius);

  node.setExtension(OMIPhysicsShape.EXTENSION_NAME, physicsBody);
}

export function exportCapsuleCollider(
  context: ExportContext,
  entityId: bigint,
  collider: CapsuleCollider,
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const physicsBody = extension.createShape();

  physicsBody.setType("capsule");
  physicsBody.setRadius(collider.radius);
  physicsBody.setHeight(collider.height);

  node.setExtension(OMIPhysicsShape.EXTENSION_NAME, physicsBody);
}

export function exportCylinderCollider(
  context: ExportContext,
  entityId: bigint,
  collider: CylinderCollider,
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsShape);
  const physicsBody = extension.createShape();

  physicsBody.setType("cylinder");
  physicsBody.setRadius(collider.radius);
  physicsBody.setHeight(collider.height);

  node.setExtension(OMIPhysicsShape.EXTENSION_NAME, physicsBody);
}

export function exportHullCollider(
  context: ExportContext,
  entityId: bigint,
  collider: HullCollider,
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const mesh = context.meshes.get(collider.meshId);
  if (!mesh) return;

  const physicsBodyExt = context.doc.createExtension(OMIPhysicsShape);
  const physicsBody = physicsBodyExt.createShape();

  physicsBody.setType("convex");
  physicsBody.setMesh(mesh);

  node.setExtension(OMIPhysicsShape.EXTENSION_NAME, physicsBody);
}

export function exportMeshCollider(
  context: ExportContext,
  entityId: bigint,
  collider: MeshCollider,
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const mesh = context.meshes.get(collider.meshId);
  if (!mesh) return;

  const physicsBodyExt = context.doc.createExtension(OMIPhysicsShape);
  const physicsBody = physicsBodyExt.createShape();

  physicsBody.setType("trimesh");
  physicsBody.setMesh(mesh);

  node.setExtension(OMIPhysicsShape.EXTENSION_NAME, physicsBody);
}
