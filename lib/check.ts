import type { ShapeCandidate, ShapeCheck } from "./types";

export function runCheck(
  candidate: ShapeCandidate,
  declaredLoss: string[]
): ShapeCheck {
  const preserved_title = candidate.title.length > 0;
  const preserved_intent = candidate.intent.length > 0;
  const preserved_constraints = candidate.constraints.length > 0;
  const preserved_lineage = candidate.source_refs.length > 0 || candidate.entities.length > 0;
  const declared_loss_visible = declaredLoss.length > 0;

  const overall_result =
    preserved_title &&
    preserved_intent &&
    preserved_constraints &&
    declared_loss_visible
      ? "pass"
      : "fail";

  return {
    preserved_title,
    preserved_intent,
    preserved_constraints,
    preserved_lineage,
    declared_loss_visible,
    overall_result,
  };
}
