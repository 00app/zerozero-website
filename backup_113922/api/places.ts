import { sql } from "./_lib/db";
import { json, badRequest, methodNotAllowed } from "./_lib/http";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "GET") return methodNotAllowed();
  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const category = url.searchParams.get("category");

  if (!city) return badRequest("Missing city");

  const rows = await sql`
    select id::text, name, category, lat, lng, url, source
    from places
    where city = ${city} and (${category} is null or category = ${category})
    order by updated_at desc
    limit 100;
  `;

  return json(rows);
}