import { sql } from "./_lib/db";
import { json, badRequest, methodNotAllowed } from "./_lib/http";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "GET") return methodNotAllowed();
  const url = new URL(req.url);
  const tip_id = url.searchParams.get("tip_id");
  const city = url.searchParams.get("city");

  if (tip_id) {
    const rows = await sql`
      select id::text, tip_id::text, partner, price, url, in_stock, eco_badges
      from offers where tip_id = ${tip_id}
      order by updated_at desc
      limit 20;
    `;
    return json(rows);
  }

  if (city) {
    const rows = await sql`
      select o.id::text, o.tip_id::text, o.partner, o.price, o.url, o.in_stock, o.eco_badges
      from offers o
      join tips t on t.id = o.tip_id
      where t.city = ${city}
      order by o.updated_at desc
      limit 50;
    `;
    return json(rows);
  }

  return badRequest("Provide tip_id or city");
}