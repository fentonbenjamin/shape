import { buildSystemPrompt } from "./prompt";
import { runLocalShape } from "./local-engine";
import { runOpenAIShapePrompt, runAnthropicShapePrompt, runGeminiShapePrompt } from "./model";
import type { ShapeEngine, ShapeProfile } from "./types";

export async function runShapeEngine({
  engine,
  profile,
  userText,
}: {
  engine: ShapeEngine;
  profile: ShapeProfile;
  userText: string;
}): Promise<unknown> {
  if (engine === "local") {
    return runLocalShape(profile, userText);
  }

  const systemPrompt = buildSystemPrompt(profile);
  let raw: string;

  if (engine === "anthropic") {
    raw = await runAnthropicShapePrompt({ systemPrompt, userText });
  } else if (engine === "gemini") {
    raw = await runGeminiShapePrompt({ systemPrompt, userText });
  } else {
    raw = await runOpenAIShapePrompt({ systemPrompt, userText });
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Model returned invalid JSON");
  }
}
