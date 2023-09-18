import { DynamicBody, KinematicBody } from "@houseki-engine/physics";

import { OMIPhysicsBody } from "../extensions/OMI_physics_body/OMIPhysicsBody";
import { ExportContext } from "./context";

export function exportStaticBody(context: ExportContext, entityId: bigint) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsBody);
  const property = extension.createPhysicsBody();

  property.setType("Static");

  node.setExtension(property.extensionName, property);
}

export function exportDynamicBody(
  context: ExportContext,
  entityId: bigint,
  body: DynamicBody
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsBody);
  const property = extension.createPhysicsBody();

  property.setType("Dynamic");
  property.setMass(body.mass);
  property.setLinearVelocity(body.linearVelocity.toArray());
  property.setAngularVelocity(body.angularVelocity.toArray());

  node.setExtension(property.extensionName, property);
}

export function exportKinematicBody(
  context: ExportContext,
  entityId: bigint,
  body: KinematicBody
) {
  const node = context.nodes.get(entityId);
  if (!node) return;

  const extension = context.doc.createExtension(OMIPhysicsBody);
  const property = extension.createPhysicsBody();

  property.setType("Kinematic");
  property.setMass(body.mass);
  property.setLinearVelocity(body.linearVelocity.toArray());
  property.setAngularVelocity(body.angularVelocity.toArray());

  node.setExtension(property.extensionName, property);
}
