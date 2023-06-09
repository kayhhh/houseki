import { Asset, CoreStore } from "lattice-engine/core";
import {
  AmbientLight,
  DirectionalLight,
  GlobalTransform,
  Image,
  Parent,
  Scene,
  SceneStruct,
  ShadowMap,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

export function createScene(
  commands: Commands,
  coreStore: CoreStore,
  sceneStruct: SceneStruct,
  shadowResolution = 2048,
  shadowArea = 8
) {
  const canvas = document.querySelector("canvas");
  coreStore.canvas = canvas;

  const skybox = createSkybox(commands);

  const root = commands.spawn().addType(Transform).addType(GlobalTransform);

  const sceneComponent = new Scene(root, skybox);
  const scene = commands.spawn().add(sceneComponent);
  dropStruct(sceneComponent);

  sceneStruct.activeScene = scene.id;

  const parent = new Parent(scene);
  root.add(parent);

  const ambient = new AmbientLight([1, 1, 1], 0.25);
  commands
    .spawn()
    .add(ambient)
    .addType(Transform)
    .addType(GlobalTransform)
    .add(parent);
  dropStruct(ambient);

  const directionalComponent = new DirectionalLight([1, 1, 1], 0.75);
  const transform = new Transform([0, 30, 0]);

  const directional = commands
    .spawn()
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
      50
    );
    directional.add(shadowMap);
    dropStruct(shadowMap);
  }

  return { root, scene };
}

function createSkybox(commands: Commands) {
  const asset = new Asset("/Skybox.jpg", "image/jpeg");
  const image = new Image(true);

  const skybox = commands.spawn().add(asset).add(image);

  dropStruct(asset);
  dropStruct(image);

  return skybox;
}
