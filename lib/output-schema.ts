import { z } from "zod";

// Support entry: evidence for each extracted field
const supportEntrySchema = z.object({
  kind: z.enum(["explicit", "inferred"]),
  evidence: z.array(z.string()),
});

const supportMapSchema = z.record(z.string(), z.array(supportEntrySchema));

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

// Full model response: spine + result + support
export const shapeModelResponseSchema = z.object({
  spine: z.array(z.string()).min(1).max(7),
  result: z.union([narrativeSegmentSchema, conceptBlobSchema]),
  support: supportMapSchema,
});

export type NarrativeSegment = z.infer<typeof narrativeSegmentSchema>;
export type ConceptBlob = z.infer<typeof conceptBlobSchema>;
export type ShapeProfile = "narrative_segment_v0" | "concept_blob_v0";
export type ShapeOutput = NarrativeSegment | ConceptBlob;

function normalizeSupportMap(data: Record<string, unknown>): Record<string, unknown> {
  if (!data || typeof data !== "object") return data;
  const support = (data as Record<string, unknown>).support;
  if (support && typeof support === "object") {
    for (const [field, entries] of Object.entries(support as Record<string, unknown>)) {
      if (Array.isArray(entries)) {
        for (const entry of entries) {
          if (entry && typeof entry === "object" && "evidence" in entry) {
            const e = entry as Record<string, unknown>;
            if (typeof e.evidence === "string") {
              e.evidence = [e.evidence];
            }
          }
        }
      }
    }
  }
  return data;
}

export function validateModelResponse(profile: ShapeProfile, data: unknown) {
  const normalized = normalizeSupportMap(data as Record<string, unknown>);
  const parsed = shapeModelResponseSchema.parse(normalized);
  if (profile === "narrative_segment_v0") {
    narrativeSegmentSchema.parse(parsed.result);
  } else {
    conceptBlobSchema.parse(parsed.result);
  }
  return parsed;
}

export function validateOutput(profile: ShapeProfile, data: unknown) {
  if (profile === "narrative_segment_v0") {
    return narrativeSegmentSchema.parse(data);
  }
  return conceptBlobSchema.parse(data);
}
