export const config = { runtime: 'nodejs' };

import { ok, bad } from './_lib/http';

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const q = searchParams.get('q') || 'sustainable';

  const url = process.env.CODEWORDS_API_URL;
  const key = process.env.CODEWORDS_API_KEY;

  if (!lat || !lng) return bad('Missing lat/lng');

  if (url && key) {
    try {
      const r = await fetch(`${url.replace(/\/$/, '')}/places?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&q=${encodeURIComponent(q)}`, {
        headers: { 'authorization': `Bearer ${key}` },
        signal: AbortSignal.timeout(Number(process.env.CODEWORDS_TIMEOUT_MS || 12000))
      });
      if (!r.ok) return bad(`Codewords places error: ${r.status}`, 502);
      const data = await r.json();
      return ok({ source: 'codewords', items: Array.isArray(data) ? data : data?.items || [] });
    } catch (e: any) {
      return bad(`Codewords request failed: ${e?.message || e}`, 502);
    }
  }

  return ok({ source: 'noop', items: [] });
}
