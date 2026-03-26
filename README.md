# Shape

Paste text. Get structure. See what survived.

Shape takes messy text and restructures it into a meaning object — with explicit preservation, declared loss, and a check that verifies what held.

## Run

```bash
cp .env.local.example .env.local
# add your OpenAI key
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

1. You paste text
2. Shape loads the sieve card (`lib/cards/sieve_card_v1.json`)
3. The card is sent to a model as the shaping contract
4. The model reads the contract and produces structured output
5. The output is validated, cast into readable and machine forms, and checked

The card is the instruction. The model is the runtime.

## What you get back

- **Candidate**: title, intent, summary, themes, constraints, entities, questions, sources
- **Declared loss**: what was intentionally dropped
- **Cast**: human-readable markdown + machine-readable JSON
- **Check**: did the shaping preserve what it should have?
- **Signal**: strong / weak / insufficient

## View the card

Click "Sieve Card" in the results to see the exact card that shaped your text. The instruction is inspectable, not hidden.
