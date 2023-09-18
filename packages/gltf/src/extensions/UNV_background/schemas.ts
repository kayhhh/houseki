import { z } from "zod";

const TextureInfoSchema = z.object({
  index: z.number(),
  texCoord: z.number().optional(),
});

export const SceneBackgroundSchema = z.object({
  texture: TextureInfoSchema.optional(),
});

export type SceneBackgroundExtension = z.infer<typeof SceneBackgroundSchema>;
