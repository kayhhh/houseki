import { Asset, CoreStore } from "lattice-engine/core";
import {
  GlobalTransform,
  Image,
  Parent,
  Scene,
  SceneStruct,
  Transform,
} from "lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

export function createScene(
  commands: Commands,
  coreStore: CoreStore,
  sceneStruct: SceneStruct
) {
  const canvas = document.querySelector("canvas");
  coreStore.canvas = canvas;

  const asset = new Asset("/Skybox.jpg", "image/jpeg");
  const image = new Image(true);

  const skyboxId = commands.spawn(true).add(asset).add(image).id;

  dropStruct(asset);
  dropStruct(image);

  const rootId = commands
    .spawn(true)
    .addType(Transform)
    .addType(GlobalTransform).id;

  const sceneComponent = new Scene();
  sceneComponent.skyboxId = skyboxId;
  sceneComponent.rootId = rootId;

  const sceneId = commands.spawn(true).add(sceneComponent).id;

  dropStruct(sceneComponent);

  sceneStruct.activeScene = sceneId;

  const parent = new Parent(sceneId);
  commands.getById(rootId).add(parent);

  return { rootId, sceneId };
}
