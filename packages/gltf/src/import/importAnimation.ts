import { Animation } from "@gltf-transform/core";
import { Warehouse } from "@lattice-engine/core";
import {
  AnimationClip,
  KeyframeInterpolation,
  KeyframePath,
  KeyframeTrack,
} from "@lattice-engine/scene";
import { Commands, dropStruct, Entity } from "thyseus";

import { ImportContext } from "./context";

export function importAnimation(
  animation: Animation,
  root: Readonly<Entity>,
  commands: Commands,
  warehouse: Readonly<Warehouse>,
  context: ImportContext
) {
  const clip = new AnimationClip(root.id, animation.getName(), true, true);

  const entity = commands.spawn().add(clip);
  context.animationClips.push(entity.id);

  dropStruct(clip);

  const track = new KeyframeTrack();

  animation.listChannels().forEach((channel) => {
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

  dropStruct(track);
}
