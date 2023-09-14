import { z } from "zod";

const physicsBodyTypeSchema = z.enum(["Static", "Kinematic", "Dynamic"]);

export type PhysicsBodyType = z.infer<typeof physicsBodyTypeSchema>;

export const nodePhysicsBodySchema = z.object({
  angularVelocity: z.tuple([z.number(), z.number(), z.number()]).optional(),
  inertiaTensor: z
    .tuple([
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
    ])
    .optional(),
  linearVelocity: z.tuple([z.number(), z.number(), z.number()]).optional(),
  mass: z.number().optional(),
  type: physicsBodyTypeSchema,
});

export type NodePhysicsBody = z.infer<typeof nodePhysicsBodySchema>;
