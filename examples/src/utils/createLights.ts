import {
  AmbientLight,
  DirectionalLight,
  GlobalTransform,
  Parent,
  ShadowMap,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

export function createLights(
  commands: Commands,
  parentId: bigint,
  shadowResolution = 2048,
  shadowArea = 8,
) {
  const parent = new Parent(parentId);

  const ambient = new AmbientLight([1, 1, 1], 0.25);
  commands
    .spawn(true)
    .add(ambient)
    .addType(Transform)
    .addType(GlobalTransform)
    .add(parent);
  dropStruct(ambient);

  const directionalComponent = new DirectionalLight([1, 1, 1], 0.75);
  const transform = new Transform([0, 30, 0]);

  const directional = commands
    .spawn(true)
    .add(directionalComponent)
    .add(transform)
    .addType(GlobalTransform)
    .add(parent);

  dropStruct(transform);
  dropStruct(directionalComponent);
  dropStruct(parent);

  if (shadowResolution > 0) {
    const shadowMap = new ShadowMap(
      shadowResolution,
      -shadowArea,
      shadowArea,
      shadowArea,
      -shadowArea,
      0.1,
      50,
    );
    directional.add(shadowMap);
    dropStruct(shadowMap);
  }
}
