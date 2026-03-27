import { runShapeEngine } from "./engine";
import { validateModelResponse, validateOutput } from "./output-schema";
import { detectProfile } from "./detect-profile";
import { castToMarkdown, castToHostJson } from "./cast";
import { runCheck } from "./check";
import type { ShapeEngine, ShapeProfile, ShapeResult, SupportMap } from "./types";

const MAX_INPUT_LENGTH = 50_000;

export async function shape(
  rawText: string,
  profileOverride?: ShapeProfile,
  engine: ShapeEngine = "openai"
): Promise<ShapeResult> {
  if (!rawText.trim()) {
    throw new Error("Empty input");
  }

  if (rawText.length > MAX_INPUT_LENGTH) {
    throw new Error(`Input too large (${rawText.length} chars, max ${MAX_INPUT_LENGTH})`);
  }

  const profile = profileOverride ?? detectProfile(rawText);
  const parsed = await runShapeEngine({ engine, profile, userText: rawText });

  // Both engines now return {result, support}
  const validated = validateModelResponse(profile, parsed);
  const output = validated.result;
  const support = validated.support as SupportMap;

  const review_markdown = castToMarkdown(profile, output);
  const host_json_view = castToHostJson(profile, output, engine);
  const check = runCheck(profile, output, support);

  return {
    engine,
    profile,
    output,
    support,
    casts: {
      review_markdown,
      host_json_view,
    },
    check,
  };
}
