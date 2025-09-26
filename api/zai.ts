export const config = { runtime: 'nodejs' };

import { ok, bad, readJson } from './_lib/http';

type ZaiReq = { query?: string; city?: string; profile?: any; session_id?: string };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return ok({ success: true, message: 'Zai chat is live (POST JSON to chat).' });

  const body = await readJson<ZaiReq>(req);
  const query = body.query?.trim();
  if (!query) return bad('Missing query');

  const url = process.env.CODEWORDS_API_URL;
  const key = process.env.CODEWORDS_API_KEY;

  if (url && key) {
    try {
      const r = await fetch(`${url.replace(/\/$/, '')}/chat`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${key}`
        },
        body: JSON.stringify({ query, city: body.city, profile: body.profile, session_id: body.session_id }),
        signal: AbortSignal.timeout(Number(process.env.CODEWORDS_TIMEOUT_MS || 12000))
      });
      if (!r.ok) {
        const t = await r.text();
        return bad(`Codewords error: ${r.status} ${t}`, 502);
      }
      const data = await r.json();
      return ok({ success: true, message: data?.message ?? data?.reply ?? data });
    } catch (e: any) {
      return bad(`Codewords request failed: ${e?.message || e}`, 502);
    }
  }

  const demo = [
    "👋 Hi, I’m Zai. Demo mode is on while we wire everything.",
    "💡 Tip: check your boiler flow temp (55–60°C can save energy).",
    "🌍 Full AI chat will be enabled once Codewords is connected."
  ];
  const reply = demo[Math.floor(Math.random() * demo.length)];
  return ok({ success: true, message: reply });
}
