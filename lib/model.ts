import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

// Lazy-init all clients to avoid build-time crashes when keys aren't set

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic();
  return _anthropic;
}

let _gemini: GoogleGenAI | null = null;
function getGemini() {
  if (!_gemini) _gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "" });
  return _gemini;
}

export async function runOpenAIShapePrompt({
  systemPrompt,
  userText,
}: {
  systemPrompt: string;
  userText: string;
}): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4.1",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userText },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

export async function runAnthropicShapePrompt({
  systemPrompt,
  userText,
}: {
  systemPrompt: string;
  userText: string;
}): Promise<string> {
  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    temperature: 0,
    system: systemPrompt,
    messages: [{ role: "user", content: userText }],
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected Anthropic response type");
  return block.text;
}

export async function runGeminiShapePrompt({
  systemPrompt,
  userText,
}: {
  systemPrompt: string;
  userText: string;
}): Promise<string> {
  const response = await getGemini().models.generateContent({
    model: "gemini-2.5-flash",
    contents: userText,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0,
      responseMimeType: "application/json",
    },
  });
  return response.text ?? "";
}
