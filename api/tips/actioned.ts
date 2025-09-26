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
    await sql`
      insert into user_totals (session_id, actions_count)
      values (${session_id}, 1)
      on conflict (session_id) do update set actions_count = user_totals.actions_count + 1;
    `;
    await sql`insert into user_tip_seen (session_id, tip_id, actioned) values (${session_id}, ${tip_id}, true) on conflict (session_id, tip_id) do update set actioned = true;`;
    return ok({ success: true });
  } catch (e: any) {
    return bad(`DB error: ${e?.message || e}`, 500);
  }
}
