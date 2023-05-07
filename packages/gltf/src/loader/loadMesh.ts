import { Mesh } from "@gltf-transform/core";
import { Geometry, IsMesh, warehouse } from "@lattice-engine/core";
import { EntityCommands } from "thyseus";

export function loadMesh(mesh: Mesh, entity: EntityCommands) {
  entity.addType(IsMesh);

  // Hack: Not having a geomtry before we add primitives breaks things ?
  const geometry = new Geometry();
  entity.add(geometry);

  // Create geometries
  mesh.listPrimitives().forEach((primitive) => {
    const geometry = new Geometry();

    const positions = primitive.getAttribute("POSITION")?.getArray();
    const normals = primitive.getAttribute("NORMAL")?.getArray();
    const uvs = primitive.getAttribute("TEXCOORD_0")?.getArray();
    const indices = primitive.getIndices()?.getArray();

    if (positions) geometry.positions.id = warehouse.store(positions);
    if (normals) geometry.normals.id = warehouse.store(normals);
    if (uvs) geometry.uvs.id = warehouse.store(uvs);
    if (indices) geometry.indices.id = warehouse.store(indices);

    entity.add(geometry);
  });
}
