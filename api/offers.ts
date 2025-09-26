export const config = { runtime: 'nodejs' };

import { getDb } from './_lib/db';
import { ok, bad } from './_lib/http';

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get('city') || '').toLowerCase();
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || '10')));

  const url = process.env.CODEWORDS_API_URL;
  const key = process.env.CODEWORDS_API_KEY;

  if (url && key) {
    try {
      const r = await fetch(`${url.replace(/\/$/, '')}/offers?city=${encodeURIComponent(city)}&limit=${limit}`, {
        headers: { 'authorization': `Bearer ${key}` },
        signal: AbortSignal.timeout(Number(process.env.CODEWORDS_TIMEOUT_MS || 12000))
      });
      if (r.ok) {
        const data = await r.json();
        return ok({ source: 'codewords', items: Array.isArray(data) ? data : data?.items || [] });
      }
    } catch {}
  }

  try {
    const sql = getDb();
    const rows = await sql`
      select id, partner, title, url, city, category, details, image_url
      from offers
      where (${city} = '' or lower(city) = ${city})
      order by created_at desc nulls last
      limit ${limit};
    `;
    return ok({ source: 'neon', items: rows });
  } catch (e: any) {
    return bad(`DB error: ${e?.message || e}`, 500);
  }
}
