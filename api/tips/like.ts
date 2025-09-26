import { sql } from "../_lib/db";
import { json, badRequest, methodNotAllowed } from "../_lib/http";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return methodNotAllowed();
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON");
  const { user_id, tip_id } = body;
  if (!user_id || !tip_id) return badRequest("Missing user_id or tip_id");

  await sql`
    insert into likes (user_id, tip_id) values (${user_id}, ${tip_id})
    on conflict (user_id, tip_id) do nothing;
  `;

  return json({ ok: true });
}