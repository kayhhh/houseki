import { Transform } from "@lattice-engine/scene";

import { ExportContext } from "./context";

export function exportNode(
  context: ExportContext,
  entityId: bigint,
  parentId: bigint,
  transform: Transform
) {
  const node = context.doc.createNode();

  node.setTranslation(transform.translation.toArray());
  node.setRotation(transform.rotation.toArray());
  node.setScale(transform.scale.toArray());

  const mesh = context.meshes.get(entityId);
  if (mesh) node.setMesh(mesh);

  context.nodes.set(entityId, node);
  context.parents.set(entityId, parentId);
}
