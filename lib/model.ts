import OpenAI from "openai";

let _client: OpenAI | null = null;
function getClient() {
  if (!_client) _client = new OpenAI();
  return _client;
}

export async function runShapePrompt({
  systemPrompt,
  userText,
}: {
  systemPrompt: string;
  userText: string;
}): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userText },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

export { runShapePrompt as runOpenAIShapePrompt };
