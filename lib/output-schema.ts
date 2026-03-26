import { z } from "zod";

// Cross-profile required fields
const crossProfileFields = {
  declared_loss: z.array(z.string()),
  signal_level: z.enum(["strong", "weak", "insufficient"]),
  inference_notes: z.array(z.string()),
};

// Profile 1: narrative_segment_v0
export const narrativeSegmentSchema = z.object({
  title: z.string().min(1),
  time_markers: z.array(z.string()),
  events: z.array(z.string()),
  actors: z.array(z.string()),
  decisions: z.array(z.string()),
  changes: z.array(z.string()).min(1, "changes is required — what shifted?"),
  felt_experience: z.array(z.string()),
  open_questions: z.array(z.string()),
  ...crossProfileFields,
});

// Profile 2: concept_blob_v0
export const conceptBlobSchema = z.object({
  title: z.string().min(1),
  core_claims: z.array(z.string()),
  layer_models: z.array(z.string()),
  distinctions: z.array(z.string()),
  principles: z.array(z.string()),
  anti_patterns: z.array(z.string()),
  design_questions: z.array(z.string()),
  next_moves: z.array(z.string()),
  ...crossProfileFields,
});

export type NarrativeSegment = z.infer<typeof narrativeSegmentSchema>;
export type ConceptBlob = z.infer<typeof conceptBlobSchema>;
export type ShapeProfile = "narrative_segment_v0" | "concept_blob_v0";
export type ShapeOutput = NarrativeSegment | ConceptBlob;

export function validateOutput(profile: ShapeProfile, data: unknown) {
  if (profile === "narrative_segment_v0") {
    return narrativeSegmentSchema.parse(data);
  }
  return conceptBlobSchema.parse(data);
}
