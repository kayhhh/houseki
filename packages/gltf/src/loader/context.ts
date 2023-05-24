import { Node } from "@gltf-transform/core";

type EntityID = bigint;

export class LoadingContext {
  readonly nodes = new Map<Node, EntityID>();

  readonly meshes: EntityID[] = [];
  readonly materials: EntityID[] = [];
  readonly animationClips: EntityID[] = [];
  readonly keyframeTracks: EntityID[] = [];
}
