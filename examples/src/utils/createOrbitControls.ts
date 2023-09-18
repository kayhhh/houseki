import { OrbitControls } from "houseki/orbit";
import { GlobalTransform, PerspectiveCamera, Transform } from "houseki/scene";
import { Commands } from "thyseus";

export function createOrbitControls(
  commands: Commands,
  translation: [number, number, number] = [0, 2, 4]
) {
  const transform = new Transform(translation);

  const cameraId = commands
    .spawn(true)
    .add(transform)
    .addType(GlobalTransform)
    .addType(PerspectiveCamera)
    .addType(OrbitControls).id;

  return cameraId;
}
