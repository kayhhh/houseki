import { Asset, CoreStore } from "houseki/core";
import { Image, Parent, Scene, SceneView, Skybox } from "houseki/scene";
import { Commands } from "thyseus";

export function createScene(commands: Commands, coreStore: CoreStore) {
  const canvas = document.querySelector("canvas");
  coreStore.canvas = canvas;

  const asset = new Asset("/Skybox.jpg", "image/jpeg");
  const image = new Image(true);
  const skyboxId = commands.spawn(true).add(asset).add(image).id;

  const skybox = new Skybox();
  skybox.imageId = skyboxId;

  const sceneId = commands
    .spawn(true)
    .addType(Scene)
    .addType(Parent)
    .add(skybox).id;

  const view = new SceneView();
  view.scenes.push(sceneId);
  view.active = sceneId;

  const viewId = commands.spawn(true).add(view).id;

  return { sceneId, viewId };
}
