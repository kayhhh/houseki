import { Node } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { Commands } from "thyseus";

import { ImportContext } from "./context";
import { importCollider } from "./importCollider";
import { importMesh } from "./importMesh";
import { importPhysicsBody } from "./importPhysicsBody";
import { importText } from "./importText";

export function importNode(
  node: Node,
  parentId: bigint,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
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

  context.name.value = node.getName() || `Node_${context.nodes.size}`;

  const entityId = commands
    .spawn(true)
    .add(context.transform)
    .add(context.globalTransform)
    .add(context.parent)
    .add(context.name).id;

  context.nodes.set(node, entityId);

  const mesh = node.getMesh();
  if (mesh) importMesh(mesh, entityId, commands, warehouse, context);

  importCollider(context, commands, node, entityId);
  importPhysicsBody(context, commands, node, entityId);
  importText(commands, node, entityId);

  node
    .listChildren()
    .forEach((child) =>
      importNode(child, entityId, commands, warehouse, context)
    );
}
