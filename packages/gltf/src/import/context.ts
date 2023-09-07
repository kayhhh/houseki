import { Material, Mesh, Node } from "@gltf-transform/core";
import {
  BoxCollider,
  CapsuleCollider,
  CylinderCollider,
  DynamicBody,
  HullCollider,
  KinematicBody,
  MeshCollider,
  SphereCollider,
  TargetTransform,
} from "@reddo/physics";
import { GlobalTransform, Name, Parent, Transform } from "@reddo/scene";

type EntityID = bigint;

export class ImportContext {
  readonly nodes = new Map<Node, EntityID>();
  readonly meshes = new Map<Mesh, EntityID>();
  readonly materials = new Map<Material, EntityID>();

  readonly meshIds: EntityID[] = [];
  readonly materialIds: EntityID[] = [];
  readonly textureIds: EntityID[] = [];
  readonly animationClipIds: EntityID[] = [];
  readonly animationMixerIds: EntityID[] = [];
  readonly keyframeTrackIds: EntityID[] = [];

  readonly parent = new Parent();
  readonly transform = new Transform();
  readonly globalTransform = new GlobalTransform();
  readonly targetTransform = new TargetTransform();
  readonly name = new Name();

  readonly kinematicBody = new KinematicBody();
  readonly dynamicBody = new DynamicBody();

  readonly boxCollider = new BoxCollider();
  readonly sphereCollider = new SphereCollider();
  readonly capsuleCollider = new CapsuleCollider();
  readonly cylinderCollider = new CylinderCollider();
  readonly hullCollider = new HullCollider();
  readonly meshCollider = new MeshCollider();
}
