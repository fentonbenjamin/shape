# Shape

Paste text. Get structure. See what survived.

Shape takes messy text and restructures it into a structured meaning object — not a summary, but a separation of what was said, what was inferred, and what was lost.

## Two Profiles

**Narrative** (`narrative_segment_v0`) — for life story, memoir, transcript, personal narrative:

```
time_markers, events, actors, decisions, changes,
felt_experience, open_questions
```

**Concept** (`concept_blob_v0`) — for systems thinking, architecture, theory, design argumentation:

```
core_claims, layer_models, distinctions, principles,
anti_patterns, design_questions, next_moves
```

Both profiles always include: `declared_loss`, `signal_level`, `inference_notes`.

## What Makes It Different

Shape does 6 things normal summaries don't:

1. Separates **explicit** from **inferred**
2. Surfaces **distinctions**
3. Extracts **changes** or **design rules**
4. Preserves **open questions**
5. Declares **loss** — what was dropped and why
6. Returns **insufficient_signal** when the text doesn't have enough structure

## Run (web)

```bash
cp .env.local.example .env.local
# add your OpenAI key
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Paste text, select a profile or let it auto-detect, hit Shape.

## How It Works

1. You paste text
2. Shape detects the profile (narrative or concept) or you override
3. The sieve card (`lib/cards/sieve_card_v1.json`) is loaded as the shaping contract
4. The contract + your text are sent to a model
5. The model follows the contract: preserve structure, separate explicit from inferred, declare loss
6. Output is validated, cast into markdown and JSON, and checked

The card is the instruction. The model is one interpreter.

## What You Get Back

- **Structured output**: profile-specific fields (events/actors/changes OR claims/distinctions/principles)
- **Inference notes**: what the model inferred vs what was explicitly stated
- **Declared loss**: what was intentionally dropped and why
- **Signal level**: strong / weak / insufficient
- **Cast**: human-readable markdown + machine-readable JSON
- **Check**: did the shaping preserve what it should have?

## View the Card

Click "Sieve Card" in the results to see the exact card that shaped your text. The instruction is inspectable, not hidden.

## Engines

Currently: OpenAI (LLM interpreter).

Coming: local engine (heuristic interpreter, no API key, runs offline). Same profiles, same contracts, same checks. Different interpreter.
