import type { ShapeProfile, NarrativeSegment, ConceptBlob } from "./output-schema";

export type { ShapeProfile, NarrativeSegment, ConceptBlob };
export type ShapeEngine = "openai" | "local";

export interface SupportEntry {
  kind: "explicit" | "inferred";
  evidence: string[];
}

export type SupportMap = Record<string, SupportEntry[]>;

export interface ShapeCheck {
  structure_valid: boolean;
  declared_loss_present: boolean;
  signal_level_present: boolean;
  explicit_vs_inferred_present: boolean;
  required_profile_fields_present: boolean;
  support_present: boolean;
  spine_present: boolean;
  compression_holds: boolean;
  profile_specific: Record<string, boolean>;
  overall_result: "pass" | "fail";
}

export interface ShapeResult {
  engine: ShapeEngine;
  profile: ShapeProfile;
  spine: string[];
  output: NarrativeSegment | ConceptBlob;
  support: SupportMap;
  casts: {
    review_markdown: string;
    host_json_view: object;
  };
  check: ShapeCheck;
}
