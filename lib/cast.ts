import type { ShapeCandidate } from "./types";

export function castToMarkdown(
  candidate: ShapeCandidate,
  declaredLoss: string[]
): string {
  const sections: string[] = [];

  sections.push(`# ${candidate.title}`);
  sections.push(`\n**Intent:** ${candidate.intent}`);
  sections.push(`\n${candidate.summary}`);

  if (candidate.themes.length > 0) {
    sections.push(`\n## Themes\n${candidate.themes.map((t) => `- ${t}`).join("\n")}`);
  }

  if (candidate.constraints.length > 0) {
    sections.push(`\n## Constraints\n${candidate.constraints.map((c) => `- ${c}`).join("\n")}`);
  }

  if (candidate.entities.length > 0) {
    sections.push(`\n## Entities\n${candidate.entities.map((e) => `- ${e}`).join("\n")}`);
  }

  if (candidate.questions.length > 0) {
    sections.push(`\n## Open Questions\n${candidate.questions.map((q) => `- ${q}`).join("\n")}`);
  }

  if (candidate.source_refs.length > 0) {
    sections.push(`\n## Sources\n${candidate.source_refs.map((r) => `- ${r}`).join("\n")}`);
  }

  if (declaredLoss.length > 0) {
    sections.push(`\n## Declared Loss\n${declaredLoss.map((l) => `- ${l}`).join("\n")}`);
  }

  return sections.join("\n");
}

export function castToHostJson(
  candidate: ShapeCandidate,
  declaredLoss: string[]
): object {
  return {
    ...candidate,
    declared_loss: declaredLoss,
    cast_type: "host_json_view",
    cast_version: "1.0.0",
  };
}
