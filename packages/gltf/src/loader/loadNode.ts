import { Node as GltfNode } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import {
  GlobalTransform,
  Node,
  Parent,
  Transform,
} from "@lattice-engine/scene";
import { Commands } from "thyseus";

import { LoadingContext } from "./context";
import { loadMesh } from "./loadMesh";

/**
 * Recursively loads a GLTF node and its children.
 */
export function loadNode(
  node: GltfNode,
  parentId: bigint,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: LoadingContext
) {
  const nodePosition = node.getTranslation();
  const nodeRotation = node.getRotation();
  const nodeScale = node.getScale();

  const transform = new Transform(nodePosition, nodeRotation, nodeScale);

  const parentComponent = new Parent();
  parentComponent.id = parentId;

  const entity = commands
    .spawn()
    .addType(Node)
    .addType(GlobalTransform)
    .add(parentComponent)
    .add(transform);

  context.nodes.set(node, entity.id);

  const mesh = node.getMesh();
  if (mesh) loadMesh(mesh, entity, commands, warehouse, context);

  node
    .listChildren()
    .forEach((child) =>
      loadNode(child, entity.id, commands, warehouse, context)
    );
}
