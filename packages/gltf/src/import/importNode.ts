import { Node } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { GlobalTransform, Parent, Transform } from "@lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

import { ImportContext } from "./context";
import { importMesh } from "./importMesh";

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

  const transform = new Transform(nodePosition, nodeRotation, nodeScale);

  const parentComponent = new Parent();
  parentComponent.id = parentId;

  const entity = commands
    .spawn()
    .add(transform)
    .addType(GlobalTransform)
    .add(parentComponent);

  dropStruct(transform);
  dropStruct(parentComponent);

  context.nodes.set(node, entity.id);

  const mesh = node.getMesh();
  if (mesh) importMesh(mesh, entity, commands, warehouse, context);

  node
    .listChildren()
    .forEach((child) =>
      importNode(child, entity.id, commands, warehouse, context)
    );
}
