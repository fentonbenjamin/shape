import type { ShapeProfile, NarrativeSegment, ConceptBlob } from "./types";

function renderArray(label: string, items: string[]): string {
  if (items.length === 0) return "";
  return `\n## ${label}\n${items.map((i) => `- ${i}`).join("\n")}`;
}

export function castToMarkdown(
  profile: ShapeProfile,
  output: NarrativeSegment | ConceptBlob
): string {
  const sections: string[] = [];
  sections.push(`# ${output.title}`);

  if (profile === "narrative_segment_v0") {
    const n = output as NarrativeSegment;
    sections.push(renderArray("Time Markers", n.time_markers));
    sections.push(renderArray("Events", n.events));
    sections.push(renderArray("Actors", n.actors));
    sections.push(renderArray("Decisions", n.decisions));
    sections.push(renderArray("Changes", n.changes));
    sections.push(renderArray("Felt Experience", n.felt_experience));
    sections.push(renderArray("Open Questions", n.open_questions));
  } else {
    const c = output as ConceptBlob;
    sections.push(renderArray("Core Claims", c.core_claims));
    sections.push(renderArray("Layer Models", c.layer_models));
    sections.push(renderArray("Distinctions", c.distinctions));
    sections.push(renderArray("Principles", c.principles));
    sections.push(renderArray("Anti-Patterns", c.anti_patterns));
    sections.push(renderArray("Design Questions", c.design_questions));
    sections.push(renderArray("Next Moves", c.next_moves));
  }

  sections.push(renderArray("Declared Loss", output.declared_loss));
  sections.push(renderArray("Inference Notes", output.inference_notes));

  sections.push(`\n---\n**Signal:** ${output.signal_level}`);

  return sections.filter(Boolean).join("\n");
}

export function castToHostJson(
  profile: ShapeProfile,
  output: NarrativeSegment | ConceptBlob
): object {
  return {
    profile,
    ...output,
    cast_type: "host_json_view",
    cast_version: "1.0.0",
  };
}
