import sieveCard from "./cards/sieve_card_v1.json";

export function buildSystemPrompt(): string {
  return `You are executing a sieve contract. The card below defines your shaping rules.

${JSON.stringify(sieveCard, null, 2)}

Your task:
1. Read the user's raw text.
2. Shape it into a structured meaning object following the sieve contract.
3. Preserve: intent, constraints, entities, themes, questions, and source lineage.
4. Drop: noise, repetition, host-specific residue.
5. Declare loss: anything meaningful you dropped, list explicitly.
6. If the text has insufficient signal to produce a meaningful structure, return signal.level = "insufficient" with a note explaining why. Do NOT fabricate structure from nothing.

Respond with ONLY a JSON object matching this exact shape:
{
  "candidate": {
    "title": "short descriptive title",
    "intent": "what this text is trying to say or achieve",
    "summary": "compressed version of the core content",
    "themes": ["theme1", "theme2"],
    "constraints": ["constraint or boundary mentioned or implied"],
    "entities": ["named things: people, orgs, concepts, places"],
    "questions": ["open questions raised or implied"],
    "source_refs": ["any references, links, or citations found in the text"]
  },
  "declared_loss": ["what you intentionally dropped and why"],
  "signal": {
    "level": "strong" | "weak" | "insufficient",
    "note": "brief assessment of signal quality"
  }
}

No markdown. No explanation. Just the JSON.`;
}
