import { Animation } from "@gltf-transform/core";
import {
  AnimationClip,
  KeyframeInterpolation,
  KeyframePath,
  KeyframeTrack,
} from "@houseki-engine/scene";
import { Commands } from "thyseus";

import { ImportContext } from "./context";

export function importAnimation(
  animation: Animation,
  rootId: bigint,
  commands: Commands,
  context: ImportContext
) {
  const clip = new AnimationClip(rootId, animation.getName(), true, true);

  const entityId = commands.spawn(true).add(clip).id;
  context.animationClipIds.push(entityId);

  animation.listChannels().forEach((channel) => {
    const track = new KeyframeTrack();
    track.clipId = entityId;

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

    if (sampler) {
      const inputAccessor = sampler.getInput();
      const inputArray = inputAccessor?.getArray();

      if (inputArray instanceof Float32Array) {
        track.times = Array.from(inputArray);
      }

      const outputAccessor = sampler.getOutput();
      const outputArray = outputAccessor?.getArray();

      if (outputArray instanceof Float32Array) {
        track.values = Array.from(outputArray);
      }

      track.interpolation = KeyframeInterpolation[sampler.getInterpolation()];
    }

    const trackEntityId = commands.spawn(true).add(track).id;
    context.keyframeTrackIds.push(trackEntityId);
  });
}
