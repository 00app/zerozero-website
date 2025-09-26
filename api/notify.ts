import { json, badRequest, methodNotAllowed } from "./_lib/http";
import twilio from "twilio";

export const config = { runtime: "nodejs" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return methodNotAllowed();
  const body = await req.json().catch(() => null);
  const { user_id, to, message, type = "test" } = body || {};

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) return badRequest("Server missing Twilio credentials");

  if (!to) return badRequest("Missing recipient phone 'to'");

  const client = twilio(sid, token);
  const resp = await client.messages.create({ to, from, body: message ?? `Zero Zero: ${type}` });

  return json({ ok: true, sid: resp.sid });
}