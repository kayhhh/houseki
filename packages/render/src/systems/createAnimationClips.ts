import { Warehouse } from "@lattice-engine/core";
import { AnimationClip, KeyframeTrack } from "@lattice-engine/scene";
import {
  AnimationClip as ThreeAnimationClip,
  KeyframeTrack as ThreeKeyframeTrack,
} from "three";
import { Entity, Query, Res } from "thyseus";

import { RenderStore } from "../resources";

export function createAnimationClips(
  renderStore: Res<RenderStore>,
  warehouse: Res<Warehouse>,
  clips: Query<[Entity, AnimationClip]>,
  tracks: Query<[Entity, KeyframeTrack]>
) {
  const ids: bigint[] = [];

  for (const [entity, clip] of clips) {
    ids.push(entity.id);

    let object = renderStore.animationClips.get(entity.id);

    const clipTracks: ThreeKeyframeTrack[] = [];

    for (const [trackEntity, track] of tracks) {
      if (track.clipId === entity.id) {
        const trackObject = renderStore.keyframeTracks.get(trackEntity.id);
        if (trackObject) clipTracks.push(trackObject);
      }
    }

    const name = clip.name.read(warehouse) || `AnimationClip_${entity.id}`;

    // Create new objects
    if (!object) {
      object = new ThreeAnimationClip(name, undefined, clipTracks);
      renderStore.animationClips.set(entity.id, object);
    }

    // Update existing objects
    object.name = name;
    object.tracks;
  }

  // Remove deleted objects from the store
  for (const [id] of renderStore.animationClips) {
    if (!ids.includes(id)) {
      renderStore.animationClips.delete(id);
    }
  }
}
