import type { ShapeProfile, ShapeCheck, NarrativeSegment, ConceptBlob, SupportMap } from "./types";

const NARRATIVE_EVIDENCE_FIELDS = [
  "events", "actors", "decisions", "changes", "felt_experience", "time_markers",
];

const CONCEPT_EVIDENCE_FIELDS = [
  "core_claims", "layer_models", "distinctions", "principles",
  "anti_patterns", "design_questions", "next_moves",
];

function checkSupportCoverage(
  profile: ShapeProfile,
  output: Record<string, unknown>,
  support: SupportMap
): { covered: boolean; unsupported_fields: string[] } {
  const fieldKeys = profile === "narrative_segment_v0"
    ? NARRATIVE_EVIDENCE_FIELDS
    : CONCEPT_EVIDENCE_FIELDS;

  const unsupported: string[] = [];

  for (const key of fieldKeys) {
    const values = output[key];
    if (!Array.isArray(values) || values.length === 0) continue;

    const entries = support[key];
    if (!entries || entries.length === 0) {
      unsupported.push(key);
    }
  }

  return { covered: unsupported.length === 0, unsupported_fields: unsupported };
}

export function runCheck(
  profile: ShapeProfile,
  output: NarrativeSegment | ConceptBlob,
  support: SupportMap
): ShapeCheck {
  const structure_valid = output.title.length > 0;
  const declared_loss_present = output.declared_loss.length > 0;
  const signal_level_present = ["strong", "weak", "insufficient"].includes(output.signal_level);
  const explicit_vs_inferred_present = output.inference_notes.length > 0;
  const support_present = Object.keys(support).length > 0;

  const coverage = checkSupportCoverage(
    profile,
    output as unknown as Record<string, unknown>,
    support
  );

  let profile_specific: Record<string, boolean> = {};
  let required_profile_fields_present = false;

  if (profile === "narrative_segment_v0") {
    const n = output as NarrativeSegment;
    const has_changes = n.changes.length > 0;
    const has_substance = n.events.length > 0 || n.decisions.length > 0 || n.felt_experience.length > 0;
    profile_specific = {
      has_changes,
      has_substance,
      support_coverage: coverage.covered,
    };
    required_profile_fields_present = has_changes && has_substance;
  } else {
    const c = output as ConceptBlob;
    const has_claims_or_distinctions = c.core_claims.length > 0 || c.distinctions.length > 0 || c.principles.length > 0;
    const anti_next_coherent = c.anti_patterns.length === 0 || c.next_moves.length > 0;
    profile_specific = {
      has_claims_or_distinctions,
      anti_next_coherent,
      support_coverage: coverage.covered,
    };
    required_profile_fields_present = has_claims_or_distinctions;
  }

  if (!coverage.covered) {
    profile_specific.unsupported_fields = false;
  }

  const overall_result =
    structure_valid &&
    declared_loss_present &&
    signal_level_present &&
    explicit_vs_inferred_present &&
    required_profile_fields_present &&
    support_present &&
    coverage.covered
      ? "pass"
      : "fail";

  return {
    structure_valid,
    declared_loss_present,
    signal_level_present,
    explicit_vs_inferred_present,
    required_profile_fields_present,
    support_present,
    profile_specific,
    overall_result,
  };
}
