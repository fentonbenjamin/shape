import { buildSystemPrompt } from "./prompt";
import { runLocalShape } from "./local-engine";
import { runOpenAIShapePrompt } from "./model";
import { reportShapeError } from "./monitoring";
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
  const raw = await runOpenAIShapePrompt({ systemPrompt, userText });

  try {
    return JSON.parse(raw);
  } catch (err) {
    await reportShapeError(err, "runShapeEngine.parseModelJson", {
      engine,
      profile,
      raw_preview: raw.slice(0, 200),
    });
    throw new Error("Model returned invalid JSON");
  }
}
