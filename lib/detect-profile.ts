import type { ShapeProfile } from "./types";

const NARRATIVE_SIGNALS = [
  /\bi\b.*\b(remember|was|grew|moved|felt|saw|heard)\b/i,
  /\b(my|our)\s+(mother|father|family|sister|brother|parents|grandma|grandpa)\b/i,
  /\b(years?\sold|age\s?\d|born|childhood|grew\sup)\b/i,
  /\b(segment|chapter|memory|memories|story)\b/i,
  /\b(moved\sto|lived\sin|went\sto)\b/i,
  /\b(divorce|married|separated|pregnant)\b/i,
  /\b\d{4}\b/,  // year references
];

const CONCEPT_SIGNALS = [
  /\b(protocol|architecture|system|layer|abstraction)\b/i,
  /\b(pattern|principle|invariant|constraint|contract)\b/i,
  /\b(should|must|requires?|defines?|means)\b/i,
  /\b(versus|vs\.?|distinction|difference|tradeoff)\b/i,
  /\b(anti.?pattern|failure.?mode|edge.?case)\b/i,
  /\b(model|schema|spec|boot|sieve|cast|check)\b/i,
];

export function detectProfile(text: string): ShapeProfile {
  const narrativeScore = NARRATIVE_SIGNALS.filter((r) => r.test(text)).length;
  const conceptScore = CONCEPT_SIGNALS.filter((r) => r.test(text)).length;

  // Bias toward narrative if personal pronouns + time markers dominate
  if (narrativeScore > conceptScore) return "narrative_segment_v0";
  return "concept_blob_v0";
}
