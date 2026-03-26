import type { ShapeProfile, NarrativeSegment, ConceptBlob } from "./output-schema";

export type { ShapeProfile, NarrativeSegment, ConceptBlob };

export interface ShapeCheck {
  structure_valid: boolean;
  declared_loss_present: boolean;
  signal_level_present: boolean;
  explicit_vs_inferred_present: boolean;
  required_profile_fields_present: boolean;
  profile_specific: Record<string, boolean>;
  overall_result: "pass" | "fail";
}

export interface ShapeResult {
  profile: ShapeProfile;
  output: NarrativeSegment | ConceptBlob;
  casts: {
    review_markdown: string;
    host_json_view: object;
  };
  check: ShapeCheck;
}
