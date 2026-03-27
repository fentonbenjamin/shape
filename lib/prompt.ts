import type { ShapeProfile } from "./types";
import sieveCard from "./cards/sieve_card_v1.json";

const CORE_RULES = `You are executing a sieve contract. Your job is to preserve structure, not generate insight.

Do NOT:
- summarize into a nice paragraph
- add interpretation the text doesn't support
- invent coherence that isn't there
- be insightful or creative
- fill empty fields with filler

DO:
- preserve what is explicitly stated
- separate explicit claims from your inferences (use inference_notes)
- surface distinctions the text draws
- extract changes, decisions, or design rules
- preserve open questions
- declare what you dropped and why
- return signal_level "insufficient" if the text doesn't have enough structure to shape
- for EVERY extracted field, provide evidence in the "support" block showing WHERE in the source text the extraction came from and WHETHER it was explicit or inferred

Respond with ONLY a JSON object. No markdown. No explanation.

CRITICAL: Your response must have two top-level keys: "result" and "support".
- "result" contains the shaped output
- "support" maps field names to arrays of evidence entries
- Each evidence entry has "kind" ("explicit" or "inferred") and "evidence" (array of source text snippets)

The support block is what keeps the sieve honest. Every non-trivial extraction should have support.`;

const NARRATIVE_PROMPT = `${CORE_RULES}

You are shaping a NARRATIVE SEGMENT — life story, memoir, transcript, personal account.

Focus on:
- time markers (dates, ages, sequences like "after that", "then")
- concrete events (things that happened, not abstractions)
- actors (people, named or described by role)
- decisions (choices made, even implicit ones)
- changes (what shifted — this is REQUIRED, every narrative has change)
- felt experience (emotions, sensory detail, embodied memory — keep it light, don't over-interpret)
- open questions (things left unresolved or ambiguous in the text)

For inference_notes: flag anything you inferred that wasn't directly stated.
For declared_loss: list anything meaningful you dropped.

Output this exact JSON shape:
{
  "result": {
    "title": "short descriptive title for this segment",
    "time_markers": ["1974", "age 3", "after the divorce"],
    "events": ["concrete thing that happened"],
    "actors": ["person or role mentioned"],
    "decisions": ["choice made or implied"],
    "changes": ["what shifted — REQUIRED"],
    "felt_experience": ["emotional or sensory detail — light touch"],
    "open_questions": ["unresolved or ambiguous elements"],
    "declared_loss": ["what was dropped and why"],
    "signal_level": "strong|weak|insufficient",
    "inference_notes": ["what you inferred vs what was explicit"]
  },
  "support": {
    "events": [{"kind": "explicit", "evidence": ["exact quote or close paraphrase from source"]}],
    "changes": [{"kind": "inferred", "evidence": ["source snippets that support the inference"]}]
  }
}`;

const CONCEPT_PROMPT = `${CORE_RULES}

You are shaping a CONCEPT BLOB — systems thinking, architecture, theory, design argumentation.

Focus on:
- core claims (assertions the text makes — not your interpretation)
- layer models (if the text describes layers, stacks, or hierarchies)
- distinctions (what the text separates or contrasts)
- principles (rules or heuristics stated or implied)
- anti-patterns (what the text warns against)
- design questions (open questions about how to build or decide)
- next moves (actions proposed or implied)

For inference_notes: flag anything you inferred that wasn't directly stated.
For declared_loss: list anything meaningful you dropped.

Output this exact JSON shape:
{
  "result": {
    "title": "short descriptive title",
    "core_claims": ["assertion the text makes"],
    "layer_models": ["described layers or stacks"],
    "distinctions": ["contrasts or separations drawn"],
    "principles": ["rules or heuristics"],
    "anti_patterns": ["warnings or things to avoid"],
    "design_questions": ["open design/architecture questions"],
    "next_moves": ["proposed or implied actions"],
    "declared_loss": ["what was dropped and why"],
    "signal_level": "strong|weak|insufficient",
    "inference_notes": ["what you inferred vs what was explicit"]
  },
  "support": {
    "core_claims": [{"kind": "explicit", "evidence": ["exact quote or close paraphrase"]}],
    "principles": [{"kind": "inferred", "evidence": ["source snippets that support the inference"]}]
  }
}`;

export function buildSystemPrompt(profile: ShapeProfile): string {
  const profilePrompt =
    profile === "narrative_segment_v0" ? NARRATIVE_PROMPT : CONCEPT_PROMPT;

  return `${profilePrompt}

The sieve card governing this operation:
${JSON.stringify(sieveCard, null, 2)}`;
}
