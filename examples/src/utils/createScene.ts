import { Asset, CoreStore } from "houseki/core";
import {
  GlobalTransform,
  Image,
  Parent,
  Scene,
  SceneStruct,
  Skybox,
  Transform,
} from "houseki/scene";
import { Commands } from "thyseus";

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

  const rootId = commands
    .spawn(true)
    .addType(Transform)
    .addType(GlobalTransform).id;

  const skybox = new Skybox();
  skybox.imageId = skyboxId;

  const scene = new Scene();
  scene.rootId = rootId;

  const sceneId = commands.spawn(true).add(scene).add(skybox).id;

  sceneStruct.activeScene = sceneId;

  const parent = new Parent(sceneId);
  commands.getById(rootId).add(parent);

  return { rootId, sceneId };
}
