import { z } from "zod";

export const shapeCandidateSchema = z.object({
  title: z.string().min(1),
  intent: z.string().min(1),
  summary: z.string().min(1),
  themes: z.array(z.string()),
  constraints: z.array(z.string()),
  entities: z.array(z.string()),
  questions: z.array(z.string()),
  source_refs: z.array(z.string()),
});

export const shapeResponseSchema = z.object({
  candidate: shapeCandidateSchema,
  declared_loss: z.array(z.string()),
  signal: z.object({
    level: z.enum(["strong", "weak", "insufficient"]),
    note: z.string(),
  }),
});

export type ShapeResponse = z.infer<typeof shapeResponseSchema>;
