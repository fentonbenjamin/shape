import type { ShapeProfile } from "./types";
import sieveCard from "./cards/sieve_card_v1.json";

const CORE_RULES = `You are executing a sieve contract. Your job is to find the spine of a text, not restate it.

PIPELINE — follow these steps IN ORDER:

1. SEGMENT: split the source into individual sentences or short fragments.

2. LABEL: classify each fragment using the profile labels below. Every fragment gets exactly one label. Fragments that carry no structural weight get labeled "noise" or "residue".

3. COMPRESS: for every non-noise fragment, rewrite it to the SHORTEST form that preserves its meaning. No nice prose. No filler. No insight. If it cannot be honestly shortened, keep it close to the source.

4. PROMOTE: from the compressed, labeled fragments, choose the 3-5 most load-bearing ones. These form the SPINE — the minimum set that best explains the blob. Promote based on: consequence, distinction power, constraint power, decision relevance, bridge to future action.

5. BUILD: assemble the structured output from promoted + retained fragments. Promoted fragments appear in the spine. Retained fragments fill the profile fields.

6. WITNESS: for every promoted or retained field, provide a support entry showing the source evidence and whether it was explicit or inferred.

RULES:
- Your output must be SHORTER than the input. If 800 chars go in, less than 800 chars of structured content should come out.
- Do NOT re-quote full source sentences. Compress them.
- Do NOT fill every bucket. Empty fields are fine. A field with one strong entry beats a field with five weak ones.
- Return signal_level "insufficient" if the text lacks structure worth shaping. Do NOT fabricate.
- Declare loss: what you dropped and why.
- Separate explicit from inferred in inference_notes.

Respond with ONLY a JSON object. No markdown. No explanation.

RESPONSE SHAPE — three top-level keys: "spine", "result", "support".
- "spine": array of 3-5 compressed, load-bearing fragments (strings). This is the primary value.
- "result": the full profile object with compressed entries.
- "support": maps field names to arrays of {kind, evidence} entries. Evidence should be SHORT distinctive fragments from the source, not full sentences.`;

const NARRATIVE_LABELS = `
LABELS for narrative_segment_v0:
- event (something that happened)
- actor (person or role)
- decision (choice made or implied)
- change (what shifted — at least one REQUIRED)
- felt_experience (emotion, sensory detail)
- time_marker (date, age, sequence word)
- open_question (unresolved element)
- noise (filler, repetition, throat-clearing)
- residue (host-specific or context-specific material)`;

const CONCEPT_LABELS = `
LABELS for concept_blob_v0:
- claim (assertion the text makes)
- layer_model (stack, hierarchy, or layered structure)
- distinction (contrast or separation)
- principle (rule or heuristic)
- anti_pattern (warning or thing to avoid)
- design_question (open question about how to build/decide)
- next_move (proposed action)
- noise (filler, repetition, rhetoric without structural content)
- residue (host-specific or context-specific material)`;

const NARRATIVE_PROMPT = `${CORE_RULES}

You are shaping a NARRATIVE SEGMENT — life story, memoir, transcript, personal account.
${NARRATIVE_LABELS}

Output this exact JSON shape:
{
  "spine": [
    "compressed load-bearing fragment 1",
    "compressed load-bearing fragment 2",
    "compressed load-bearing fragment 3"
  ],
  "result": {
    "title": "short title (max 8 words)",
    "time_markers": ["1974", "age 3"],
    "events": ["compressed event"],
    "actors": ["role or name"],
    "decisions": ["compressed decision"],
    "changes": ["what shifted — REQUIRED, compressed"],
    "felt_experience": ["compressed sensory/emotional detail"],
    "open_questions": ["compressed question"],
    "declared_loss": ["what was dropped and why"],
    "signal_level": "strong|weak|insufficient",
    "inference_notes": ["what was inferred vs explicit"]
  },
  "support": {
    "events": [{"kind": "explicit", "evidence": ["short source fragment"]}],
    "changes": [{"kind": "inferred", "evidence": ["short source fragment"]}]
  }
}`;

const CONCEPT_PROMPT = `${CORE_RULES}

You are shaping a CONCEPT BLOB — systems thinking, architecture, theory, design argumentation.
${CONCEPT_LABELS}

Output this exact JSON shape:
{
  "spine": [
    "compressed load-bearing fragment 1",
    "compressed load-bearing fragment 2",
    "compressed load-bearing fragment 3"
  ],
  "result": {
    "title": "short title (max 8 words)",
    "core_claims": ["compressed claim"],
    "layer_models": ["compressed layer description"],
    "distinctions": ["compressed contrast"],
    "principles": ["compressed rule"],
    "anti_patterns": ["compressed warning"],
    "design_questions": ["compressed question"],
    "next_moves": ["compressed action"],
    "declared_loss": ["what was dropped and why"],
    "signal_level": "strong|weak|insufficient",
    "inference_notes": ["what was inferred vs explicit"]
  },
  "support": {
    "core_claims": [{"kind": "explicit", "evidence": ["short source fragment"]}],
    "principles": [{"kind": "inferred", "evidence": ["short source fragment"]}]
  }
}`;

export function buildSystemPrompt(profile: ShapeProfile): string {
  const profilePrompt =
    profile === "narrative_segment_v0" ? NARRATIVE_PROMPT : CONCEPT_PROMPT;

  return `${profilePrompt}

The sieve card governing this operation:
${JSON.stringify(sieveCard, null, 2)}`;
}
