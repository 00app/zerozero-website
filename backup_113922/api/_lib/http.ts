export function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export function badRequest(msg: string) {
  return json({ ok: false, error: msg }, 400);
}

export function methodNotAllowed() {
  return json({ ok: false, error: "Method not allowed" }, 405);
}