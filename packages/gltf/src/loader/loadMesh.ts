import { Mesh as GltfMesh } from "@gltf-transform/core";
import { Geometry, Mesh, warehouse } from "@lattice-engine/core";
import { Commands, EntityCommands } from "thyseus";

import { loadMaterial } from "./loadMaterial";

export function loadMesh(
  gltfMesh: GltfMesh,
  entity: EntityCommands,
  commands: Commands
) {
  const mesh = new Mesh();

  // Hack: Not having a geomtry before we add primitives breaks things ?
  const geometry = new Geometry();
  entity.add(geometry);

  // Create geometries
  gltfMesh.listPrimitives().forEach((primitive) => {
    const geometry = new Geometry();

    const positions = primitive.getAttribute("POSITION")?.getArray();
    const normals = primitive.getAttribute("NORMAL")?.getArray();
    const uvs = primitive.getAttribute("TEXCOORD_0")?.getArray();
    const indices = primitive.getIndices()?.getArray();

    if (positions) geometry.positions.id = warehouse.store(positions);
    if (normals) geometry.normals.id = warehouse.store(normals);
    if (uvs) geometry.uvs.id = warehouse.store(uvs);
    if (indices) geometry.indices.id = warehouse.store(indices);

    const material = primitive.getMaterial();
    if (material) mesh.material = loadMaterial(material, commands).id;

    entity.add(geometry);
  });

  entity.add(mesh);
}
