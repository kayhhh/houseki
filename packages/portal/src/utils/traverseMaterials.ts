import { Material, Object3D } from "three";

export function traverseMaterials(
  object: Object3D,
  callback: (material: Material) => void,
) {
  object.traverse((obj) => {
    // @ts-expect-error
    if (!obj.isMesh && !obj.isLine) return;

    // @ts-expect-error
    const material = obj.material as Material | Material[];

    if (Array.isArray(material)) {
      material.forEach((m) => callback(m));
    } else {
      callback(material);
    }
  });
}
