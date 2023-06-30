import { Animation } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import {
  AnimationClip,
  KeyframeInterpolation,
  KeyframePath,
  KeyframeTrack,
} from "@lattice-engine/scene";
import { Commands, dropStruct } from "thyseus";

import { ImportContext } from "./context";

export function importAnimation(
  animation: Animation,
  rootId: bigint,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: ImportContext
) {
  const clip = new AnimationClip(rootId, animation.getName(), true, true);

  const entityId = commands.spawn().add(clip).id;
  context.animationClipIds.push(entityId);

  dropStruct(clip);

  const track = new KeyframeTrack();

  animation.listChannels().forEach((channel) => {
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

    const trackEntityId = commands.spawn().add(track).id;
    context.keyframeTrackIds.push(trackEntityId);
  });

  dropStruct(track);
}
