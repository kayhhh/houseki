import { Node } from "@gltf-transform/core";

type EntityID = bigint;

export class ImportContext {
  readonly nodes = new Map<Node, EntityID>();

  readonly meshes: EntityID[] = [];
  readonly materials: EntityID[] = [];
  readonly textures: EntityID[] = [];
  readonly animationClips: EntityID[] = [];
  readonly animationMixers: EntityID[] = [];
  readonly keyframeTracks: EntityID[] = [];
}
