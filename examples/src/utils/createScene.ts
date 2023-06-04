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
import { Commands } from "thyseus";

export function createScene(
  commands: Commands,
  coreStore: CoreStore,
  sceneStruct: SceneStruct,
  shadowResolution = 2048,
  shadowArea = 8
) {
  const canvas = document.querySelector("canvas");
  coreStore.canvas = canvas;

  const skybox = commands
    .spawn()
    .add(new Asset("/Skybox.jpg", "image/jpeg"))
    .add(new Image(true));
  const scene = commands.spawn().add(new Scene(skybox));
  sceneStruct.activeScene = scene.id;

  commands
    .spawn()
    .add(new AmbientLight([1, 1, 1], 0.25))
    .addType(Transform)
    .addType(GlobalTransform)
    .add(new Parent(scene));

  const directional = commands
    .spawn()
    .add(new DirectionalLight([1, 1, 1], 0.75))
    .add(new Transform([0, 30, 0]))
    .addType(GlobalTransform)
    .add(new Parent(scene));

  if (shadowResolution > 0) {
    directional.add(
      new ShadowMap(
        shadowResolution,
        -shadowArea,
        shadowArea,
        shadowArea,
        -shadowArea,
        0.1,
        50
      )
    );
  }

  return scene;
}
