# @reddo/physics

Physics using [Rapier](https://rapier.rs/).

## Rigidbody

A rigidbody is a component that allows an entity to be affected by physics. It can be attached to an entity in the scene that has a `Transform` component.

- `StaticBody` - a body that does not move
- `DynamicBody` - a body that is affected by forces, such as gravity
- `KinematicBody` - a velocity-based body that is not affected by forces

### TargetTransform

Optionally, a `TargetTransform` component can be attached to a rigidbody. This will automatically smooth the rigidbody's position and rotation between physics steps. Any changes to the rigidbody's position or rotation should be done through the `TargetTransform` component.

## Collider

One or more colliders can be attached to a rigidbody. For a single collider, the collider component can be attached directly to the rigidbody entity. For multiple colliders, each collider should be attached to a separate entity, and use the `Parent` component to attach to the rigidbody entity.

- `BoxCollider` - a box collider
- `CapsuleCollider` - a capsule collider
- `CylinderCollider` - a cylinder collider
- `HullCollider` - a convex hull collider
- `MeshCollider` - a mesh collider
- `SphereCollider` - a sphere collider
