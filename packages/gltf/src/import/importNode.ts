import { Node } from "@gltf-transform/core";
import { Warehouse } from "@houseki-engine/core";
import { Commands } from "thyseus";

import { ImportContext } from "./context";
import { importCollider } from "./importCollider";
import { importExtras } from "./importExtras";
import { importMesh } from "./importMesh";
import { importPhysicsBody } from "./importPhysicsBody";
import { importText } from "./importText";

export function importNode(
  warehouse: Warehouse,
  node: Node,
  parentId: bigint,
  commands: Commands,
  context: ImportContext
) {
  const nodePosition = node.getTranslation();
  const nodeRotation = node.getRotation();
  const nodeScale = node.getScale();

  const globalPosition = node.getWorldTranslation();
  const globalRotation = node.getWorldRotation();
  const globalScale = node.getWorldScale();

  context.transform.set(nodePosition, nodeRotation, nodeScale);
  context.globalTransform.set(globalPosition, globalRotation, globalScale);
  context.parent.id = parentId;
  context.name.value = node.getName();

  const entityId = commands
    .spawn(true)
    .add(context.transform)
    .add(context.globalTransform)
    .add(context.parent)
    .add(context.name).id;

  context.nodes.set(node, entityId);

  const mesh = node.getMesh();
  if (mesh) {
    importMesh(warehouse, mesh, entityId, commands, context);
  }

  importCollider(context, commands, node, entityId);
  importPhysicsBody(context, commands, node, entityId);
  importText(commands, node, entityId);
  importExtras(commands, node, entityId);

  node
    .listChildren()
    .forEach((child) =>
      importNode(warehouse, child, entityId, commands, context)
    );

  return entityId;
}
