import { Node } from "@gltf-transform/core";
import {
  IsNode,
  Parent,
  Position,
  Rotation,
  Scale,
} from "@lattice-engine/core";
import { Commands, Entity, EntityCommands } from "thyseus";

import { loadMesh } from "./loadMesh";

/**
 * Recursively loads a GLTF node and its children.
 */
export function loadNode(
  node: Node,
  parent: Readonly<Entity> | EntityCommands,
  commands: Commands
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
  parentComponent.id = parent.id;

  const entity = commands
    .spawn()
    .addType(IsNode)
    .add(parentComponent)
    .add(position)
    .add(rotation)
    .add(scale);

  const mesh = node.getMesh();
  if (mesh) loadMesh(mesh, entity);

  node.listChildren().forEach((child) => loadNode(child, entity, commands));
}
