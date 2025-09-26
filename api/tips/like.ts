export const config = { runtime: 'nodejs' };

import { getDb } from '../_lib/db';
import { ok, bad, readJson } from '../_lib/http';

type Body = { session_id?: string; tip_id?: string };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return bad('POST expected');
  const { session_id, tip_id } = await readJson<Body>(req);
  if (!session_id || !tip_id) return bad('Missing session_id or tip_id');

  try {
    const sql = getDb();
    await sql`insert into likes (session_id, tip_id) values (${session_id}, ${tip_id}) on conflict do nothing;`;
    return ok({ success: true });
  } catch (e: any) {
    return bad(`DB error: ${e?.message || e}`, 500);
  }
}
