import { AnimationClip, KeyframeTrack, Parent } from "@lattice-engine/scene";
import {
  AnimationClip as ThreeAnimationClip,
  KeyframeTrack as ThreeKeyframeTrack,
} from "three";
import { Entity, Query, Res, With } from "thyseus";

import { RenderStore } from "../RenderStore";

export function createAnimationClips(
  renderStore: Res<RenderStore>,
  clips: Query<[Entity, AnimationClip]>,
  tracks: Query<[Entity, Parent], With<KeyframeTrack>>
) {
  const ids: bigint[] = [];

  for (const [entity, clip] of clips) {
    ids.push(entity.id);

    let object = renderStore.animationClips.get(entity.id);

    const clipTracks: ThreeKeyframeTrack[] = [];

    for (const [trackEntity, parent] of tracks) {
      if (parent.id === entity.id) {
        const trackObject = renderStore.keyframeTracks.get(trackEntity.id);
        if (trackObject) clipTracks.push(trackObject);
      }
    }

    // Create new objects
    if (!object) {
      const name = clip.name || `AnimationClip_${entity.id}`;
      object = new ThreeAnimationClip(name, undefined, clipTracks);
      renderStore.animationClips.set(entity.id, object);
    }
  }

  // Remove deleted objects from the store
  for (const [id] of renderStore.animationClips) {
    if (!ids.includes(id)) {
      renderStore.animationClips.delete(id);
    }
  }
}
