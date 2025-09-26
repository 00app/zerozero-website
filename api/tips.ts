export const config = { runtime: 'nodejs' };

import { getDb } from './_lib/db';
import { ok, bad } from './_lib/http';

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get('city') || '').toLowerCase();
  const bucket = (searchParams.get('bucket') || 'today').toLowerCase();
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || '10')));
  const dynamic = searchParams.get('dynamic') === '1';

  const url = process.env.CODEWORDS_API_URL;
  const key = process.env.CODEWORDS_API_KEY;

  if (dynamic && url && key) {
    try {
      const r = await fetch(`${url.replace(/\/$/, '')}/tips?city=${encodeURIComponent(city)}&bucket=${encodeURIComponent(bucket)}&limit=${limit}`, {
        headers: { 'authorization': `Bearer ${key}` },
        signal: AbortSignal.timeout(Number(process.env.CODEWORDS_TIMEOUT_MS || 12000))
      });
      if (!r.ok) return bad(`Codewords tips error: ${r.status}`, 502);
      const data = await r.json();
      return ok({ source: 'codewords', items: Array.isArray(data) ? data : data?.items || [] });
    } catch (e: any) {
      return bad(`Codewords request failed: ${e?.message || e}`, 502);
    }
  }

  try {
    const sql = getDb();
    const rows = await sql`
      select id, city, category, title, body, savings_est, carbon_est, rotation_bucket, lat, lng, url
      from tips
      where (${city} = '' or lower(city) = ${city})
        and rotation_bucket = ${bucket}
      order by created_at desc nulls last
      limit ${limit};
    `;
    return ok({ source: 'neon', items: rows });
  } catch (e: any) {
    return bad(`DB error: ${e?.message || e}`, 500);
  }
}
