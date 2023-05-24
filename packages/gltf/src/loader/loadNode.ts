import { Node as GltfNode } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import { Node, Parent, Position, Rotation, Scale } from "@lattice-engine/scene";
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

  const position = new Position();
  position.x = nodePosition[0];
  position.y = nodePosition[1];
  position.z = nodePosition[2];

  const rotation = new Rotation();
  rotation.x = nodeRotation[0];
  rotation.y = nodeRotation[1];
  rotation.z = nodeRotation[2];
  rotation.w = nodeRotation[3];

  const scale = new Scale();
  scale.x = nodeScale[0];
  scale.y = nodeScale[1];
  scale.z = nodeScale[2];

  const parentComponent = new Parent();
  parentComponent.id = parentId;

  const entity = commands
    .spawn()
    .addType(Node)
    .add(parentComponent)
    .add(position)
    .add(rotation)
    .add(scale);

  context.nodes.set(node, entity.id);

  const mesh = node.getMesh();
  if (mesh) loadMesh(mesh, entity, commands, warehouse, context);

  node
    .listChildren()
    .forEach((child) =>
      loadNode(child, entity.id, commands, warehouse, context)
    );
}
