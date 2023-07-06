import { z } from "zod";

export const textSchema = z.object({
  alignX: z.enum(["left", "center", "right"]).optional(),
  alignY: z.enum(["top", "middle", "bottom"]).optional(),
  color: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  fontFile: z.string().optional(),
  size: z.number().optional(),
  value: z.string(),
});

export type TextDef = z.infer<typeof textSchema>;
