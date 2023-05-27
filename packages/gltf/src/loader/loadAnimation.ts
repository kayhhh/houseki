import { Animation } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import {
  AnimationClip,
  KeyframeInterpolation,
  KeyframePath,
  KeyframeTrack,
} from "@lattice-engine/scene";
import { Commands, Entity } from "thyseus";

import { LoadingContext } from "./context";

export function loadAnimation(
  animation: Animation,
  root: Readonly<Entity>,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: LoadingContext
) {
  const entity = commands
    .spawn()
    .add(new AnimationClip(root.id, animation.getName(), true, true));
  context.animationClips.push(entity.id);

  animation.listChannels().forEach((channel) => {
    const track = new KeyframeTrack();

    track.clipId = entity.id;

    const sampler = channel.getSampler();
    const targetNode = channel.getTargetNode();
    const targetPath = channel.getTargetPath();

    if (targetNode) {
      const nodeEntityId = context.nodes.get(targetNode);
      if (nodeEntityId) track.targetId = nodeEntityId;
    }

    switch (targetPath) {
      case "translation": {
        track.path = KeyframePath.POSITION;
        break;
      }

      case "rotation": {
        track.path = KeyframePath.ROTATION;
        break;
      }

      case "scale": {
        track.path = KeyframePath.SCALE;
        break;
      }

      case "weights": {
        track.path = KeyframePath.WEIGHTS;
        break;
      }

      default: {
        console.warn(`Unsupported animation target path: ${targetPath}`);
        return;
      }
    }

    // Initialize empty tracks to avoid errors
    track.times.write(new Float32Array(), warehouse);
    track.values.write(new Float32Array(), warehouse);

    if (sampler) {
      const inputAccessor = sampler.getInput();
      const inputArray = inputAccessor?.getArray();

      if (inputArray instanceof Float32Array) {
        track.times.write(inputArray, warehouse);
      }

      const outputAccessor = sampler.getOutput();
      const outputArray = outputAccessor?.getArray();

      if (outputArray instanceof Float32Array) {
        track.values.write(outputArray, warehouse);
      }

      track.interpolation = KeyframeInterpolation[sampler.getInterpolation()];
    }

    const trackEntity = commands.spawn().add(track);
    context.keyframeTracks.push(trackEntity.id);
  });
}
