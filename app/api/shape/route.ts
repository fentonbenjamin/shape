import { NextRequest, NextResponse } from "next/server";
import { shape } from "@/lib/shape";
import type { ShapeEngine, ShapeProfile } from "@/lib/types";

const VALID_PROFILES = ["narrative_segment_v0", "concept_blob_v0"];
const VALID_ENGINES = ["openai", "local"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body?.text;
    const profile = body?.profile;
    const engine = body?.engine;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    const profileOverride =
      profile && VALID_PROFILES.includes(profile)
        ? (profile as ShapeProfile)
        : undefined;
    const engineOverride =
      engine && VALID_ENGINES.includes(engine)
        ? (engine as ShapeEngine)
        : "openai";

    const result = await shape(text, profileOverride, engineOverride);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
