import { DynamicBody, KinematicBody } from "@houseki-engine/physics";

import { OMIPhysicsBody } from "../extensions/OMI_physics_body/OMIPhysicsBody";
import { PhysicsBody } from "../extensions/OMI_physics_body/PhysicsBody";
import { ExportContext } from "./context";

export function exportStaticBody(context: ExportContext, entityId: bigint) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsBody);
  const physicsBody = extension.createPhysicsBody();

  physicsBody.setType("Static");

  node.setExtension(PhysicsBody.EXTENSION_NAME, physicsBody);
}

export function exportDynamicBody(
  context: ExportContext,
  entityId: bigint,
  body: DynamicBody
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsBody);
  const physicsBody = extension.createPhysicsBody();

  physicsBody.setType("Dynamic");
  physicsBody.setMass(body.mass);
  physicsBody.setLinearVelocity(body.linearVelocity.toArray());
  physicsBody.setAngularVelocity(body.angularVelocity.toArray());

  node.setExtension(PhysicsBody.EXTENSION_NAME, physicsBody);
}

export function exportKinematicBody(
  context: ExportContext,
  entityId: bigint,
  body: KinematicBody
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsBody);
  const physicsBody = extension.createPhysicsBody();

  physicsBody.setType("Kinematic");
  physicsBody.setMass(body.mass);
  physicsBody.setLinearVelocity(body.linearVelocity.toArray());
  physicsBody.setAngularVelocity(body.angularVelocity.toArray());

  node.setExtension(PhysicsBody.EXTENSION_NAME, physicsBody);
}
