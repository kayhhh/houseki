import { z } from "zod";

const shapeTypeSchema = z.enum([
  "box",
  "sphere",
  "capsule",
  "cylinder",
  "convex",
  "trimesh",
]);

export type ShapeType = z.infer<typeof shapeTypeSchema>;

const gltfId = z.number().min(0);

export const shapeSchema = z
  .object({
    height: z.number().optional(),
    mesh: gltfId.optional(),
    radius: z.number().optional(),
    size: z.array(z.number()).length(3).optional(),
    type: shapeTypeSchema,
  })
  .refine((obj) => {
    try {
      switch (obj.type) {
        case "box": {
          z.object({
            size: z.array(z.number()).length(3),
            type: z.literal("box"),
          }).parse(obj);
          break;
        }

        case "sphere": {
          z.object({
            radius: z.number(),
            type: z.literal("sphere"),
          }).parse(obj);
          break;
        }

        case "capsule": {
          z.object({
            height: z.number(),
            radius: z.number(),
            type: z.literal("capsule"),
          }).parse(obj);
          break;
        }

        case "cylinder": {
          z.object({
            height: z.number(),
            radius: z.number(),
            type: z.literal("cylinder"),
          }).parse(obj);
          break;
        }

        case "convex": {
          z.object({
            mesh: gltfId,
            type: z.literal("convex"),
          }).parse(obj);
          break;
        }

        case "trimesh": {
          z.object({
            mesh: gltfId,
            type: z.literal("trimesh"),
          }).parse(obj);
          break;
        }

        default: {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  });

export type ShapeJson = z.infer<typeof shapeSchema>;

export const shapeExtensionSchema = z.object({
  extensions: z.unknown().optional(),
  extras: z.unknown().optional(),
  shapes: z.array(shapeSchema).min(1),
});

export type ShapeExtensionJson = z.infer<typeof shapeExtensionSchema>;

export const nodeShapeSchema = z.object({
  extensions: z.unknown().optional(),
  extras: z.unknown().optional(),
  shape: gltfId,
});

export type NodeShapeJson = z.infer<typeof nodeShapeSchema>;
