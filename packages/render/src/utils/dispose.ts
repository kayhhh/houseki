import { MeshStandardMaterial } from "three";

export function disposeMaterial(material: MeshStandardMaterial) {
  if (material.map) material.map.dispose();
  if (material.aoMap) material.aoMap.dispose();
  if (material.emissiveMap) material.emissiveMap.dispose();
  if (material.metalnessMap) material.metalnessMap.dispose();
  if (material.roughnessMap) material.roughnessMap.dispose();
  if (material.normalMap) material.normalMap.dispose();
  if (material.displacementMap) material.displacementMap.dispose();

  material.dispose();
}
