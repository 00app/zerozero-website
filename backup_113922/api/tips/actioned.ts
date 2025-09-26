import { sql } from "../_lib/db";
import { json, badRequest, methodNotAllowed } from "../_lib/http";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return methodNotAllowed();
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON");
  const { user_id, tip_id, variant } = body;
  if (!user_id || !tip_id) return badRequest("Missing user_id or tip_id");

  // Variant multiplier
  const multiplier = variant === "large" ? 2 : variant === "medium" ? 1.5 : 1;

  const [tip] = await sql`
    select savings_est::float, carbon_est::float from tips where id = ${tip_id};
  ` as any;

  const savings = (tip?.savings_est ?? 0) * multiplier;
  const co2 = (tip?.carbon_est ?? 0) * multiplier;

  // Upsert totals
  await sql`
    insert into user_totals (user_id, realised_savings, realised_co2)
    values (${user_id}, ${savings}, ${co2})
    on conflict (user_id) do update
      set realised_savings = user_totals.realised_savings + excluded.realised_savings,
          realised_co2     = user_totals.realised_co2 + excluded.realised_co2,
          updated_at = now();
  `;

  return json({ ok: true, delta: { savings, co2 } });
}