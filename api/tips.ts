import { sql } from "./_lib/db";
import { json, badRequest, methodNotAllowed } from "./_lib/http";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "GET") return methodNotAllowed();
  const url = new URL(req.url);
  const city = url.searchParams.get("city") ?? "lisbon";
  const bucket = url.searchParams.get("bucket") ?? "today";
  const limit = parseInt(url.searchParams.get("limit") ?? "5", 10);

  const rows = await sql`
    select id::text, city, category, title, body, savings_est, carbon_est, lat, lng
    from tips
    where (city = ${city} or ${city} is null)
      and (rotation_bucket = ${bucket} or ${bucket} is null)
    order by coalesce(freshness_rank, 0) desc, updated_at desc
    limit ${limit};
  `;

  return json(rows);
}