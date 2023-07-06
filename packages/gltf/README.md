# @lattice-engine/gltf

Allows you to import and export glTF models. Uses [glTF-Transform](https://gltf-transform.donmccurdy.com/) internally.

## Extensions

The following glTF extensions are supported:

- [KHR_draco_mesh_compression](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_draco_mesh_compression/README.md)
- [KHR_texture_transform](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_texture_transform/README.md)
- [MOZ_text](https://github.com/MozillaReality/MOZ_text)
- [OMI_collider](https://github.com/omigroup/gltf-extensions/tree/main/extensions/2.0/OMI_collider)
- [OMI_physics_body](https://github.com/omigroup/gltf-extensions/tree/main/extensions/2.0/OMI_physics_body)

## Usage

Draco compression requires the consumer of this library to load the draco encoder / decoder within their page. Check out the [Draco repository](https://github.com/google/draco/tree/master/javascript/example) for more information.
