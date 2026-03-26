import type { ShapeProfile, ShapeCheck, NarrativeSegment, ConceptBlob } from "./types";

export function runCheck(
  profile: ShapeProfile,
  output: NarrativeSegment | ConceptBlob
): ShapeCheck {
  const structure_valid = output.title.length > 0;
  const declared_loss_present = output.declared_loss.length > 0;
  const signal_level_present = ["strong", "weak", "insufficient"].includes(output.signal_level);
  const explicit_vs_inferred_present = output.inference_notes.length > 0;

  let profile_specific: Record<string, boolean> = {};
  let required_profile_fields_present = false;

  if (profile === "narrative_segment_v0") {
    const n = output as NarrativeSegment;
    const has_changes = n.changes.length > 0;
    const has_substance = n.events.length > 0 || n.decisions.length > 0 || n.felt_experience.length > 0;
    profile_specific = { has_changes, has_substance };
    required_profile_fields_present = has_changes && has_substance;
  } else {
    const c = output as ConceptBlob;
    const has_claims_or_distinctions = c.core_claims.length > 0 || c.distinctions.length > 0 || c.principles.length > 0;
    const anti_next_coherent = c.anti_patterns.length === 0 || c.next_moves.length > 0;
    profile_specific = { has_claims_or_distinctions, anti_next_coherent };
    required_profile_fields_present = has_claims_or_distinctions;
  }

  const overall_result =
    structure_valid &&
    declared_loss_present &&
    signal_level_present &&
    explicit_vs_inferred_present &&
    required_profile_fields_present
      ? "pass"
      : "fail";

  return {
    structure_valid,
    declared_loss_present,
    signal_level_present,
    explicit_vs_inferred_present,
    required_profile_fields_present,
    profile_specific,
    overall_result,
  };
}
