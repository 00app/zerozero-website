import { json, badRequest, methodNotAllowed } from "./_lib/http";
import OpenAI from "openai";

export const config = { runtime: "nodejs" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return methodNotAllowed();
  const body = await req.json().catch(() => null);
  if (!body?.messages) return badRequest("Missing messages");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return badRequest("Server missing OPENAI_API_KEY");

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: body.messages
  });

  const reply = completion.choices[0]?.message?.content ?? "";
  return json({ reply });
}