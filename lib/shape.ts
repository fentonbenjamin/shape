import { buildSystemPrompt } from "./prompt";
import { runShapePrompt } from "./model";
import { shapeResponseSchema } from "./output-schema";
import { castToMarkdown, castToHostJson } from "./cast";
import { runCheck } from "./check";
import type { ShapeResult } from "./types";

const MAX_INPUT_LENGTH = 50_000;

export async function shape(rawText: string): Promise<ShapeResult> {
  if (!rawText.trim()) {
    throw new Error("Empty input");
  }

  if (rawText.length > MAX_INPUT_LENGTH) {
    throw new Error(`Input too large (${rawText.length} chars, max ${MAX_INPUT_LENGTH})`);
  }

  const systemPrompt = buildSystemPrompt();
  const raw = await runShapePrompt({ systemPrompt, userText: rawText });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Model returned invalid JSON");
  }

  const validated = shapeResponseSchema.parse(parsed);

  const { candidate, declared_loss, signal } = validated;

  const review_markdown = castToMarkdown(candidate, declared_loss);
  const host_json_view = castToHostJson(candidate, declared_loss);
  const check = runCheck(candidate, declared_loss);

  return {
    candidate,
    declared_loss,
    casts: {
      review_markdown,
      host_json_view,
    },
    check,
    signal,
  };
}
