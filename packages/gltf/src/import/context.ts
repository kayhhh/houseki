import { Material, Node } from "@gltf-transform/core";

type EntityID = bigint;

export class ImportContext {
  readonly nodes = new Map<Node, EntityID>();
  readonly materials = new Map<Material, EntityID>();

  readonly meshIds: EntityID[] = [];
  readonly materialIds: EntityID[] = [];
  readonly textureIds: EntityID[] = [];
  readonly animationClipIds: EntityID[] = [];
  readonly animationMixerIds: EntityID[] = [];
  readonly keyframeTrackIds: EntityID[] = [];
}
