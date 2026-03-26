import { buildSystemPrompt } from "./prompt";
import { runShapePrompt } from "./model";
import { validateOutput } from "./output-schema";
import { detectProfile } from "./detect-profile";
import { castToMarkdown, castToHostJson } from "./cast";
import { runCheck } from "./check";
import type { ShapeProfile, ShapeResult } from "./types";

const MAX_INPUT_LENGTH = 50_000;

export async function shape(
  rawText: string,
  profileOverride?: ShapeProfile
): Promise<ShapeResult> {
  if (!rawText.trim()) {
    throw new Error("Empty input");
  }

  if (rawText.length > MAX_INPUT_LENGTH) {
    throw new Error(`Input too large (${rawText.length} chars, max ${MAX_INPUT_LENGTH})`);
  }

  const profile = profileOverride ?? detectProfile(rawText);
  const systemPrompt = buildSystemPrompt(profile);
  const raw = await runShapePrompt({ systemPrompt, userText: rawText });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Model returned invalid JSON");
  }

  const output = validateOutput(profile, parsed);

  const review_markdown = castToMarkdown(profile, output);
  const host_json_view = castToHostJson(profile, output);
  const check = runCheck(profile, output);

  return {
    profile,
    output,
    casts: {
      review_markdown,
      host_json_view,
    },
    check,
  };
}
