import { Mesh as GltfMesh } from "@gltf-transform/core";
import {
  Geometry,
  IsNode,
  Mesh,
  Parent,
  Warehouse,
} from "@lattice-engine/core";
import { Commands, EntityCommands } from "thyseus";

import { LoadingContext } from "./context";
import { loadMaterial } from "./loadMaterial";

export function loadMesh(
  gltfMesh: GltfMesh,
  entity: EntityCommands,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: LoadingContext
) {
  gltfMesh.listPrimitives().forEach((primitive) => {
    const parent = new Parent();
    parent.id = entity.id;

    const mesh = new Mesh();
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
    if (material) {
      const materialEntity = loadMaterial(
        material,
        commands,
        warehouse,
        context
      );
      mesh.material = materialEntity.id;
    }

    const meshEnity = commands
      .spawn()
      .addType(IsNode)
      .add(parent)
      .add(mesh)
      .add(geometry);

    context.meshes.push(meshEnity.id);
  });
}
