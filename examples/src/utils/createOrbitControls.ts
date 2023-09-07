import { OrbitControls } from "reddo/orbit";
import {
  GlobalTransform,
  PerspectiveCamera,
  SceneStruct,
  Transform,
} from "reddo/scene";
import { Commands } from "thyseus";

export function createOrbitControls(
  commands: Commands,
  sceneStruct: SceneStruct,
  translation: [number, number, number] = [0, 2, 4]
) {
  const transform = new Transform(translation);

  const cameraId = commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls).id;

  sceneStruct.activeCamera = cameraId;

  return cameraId;
}
