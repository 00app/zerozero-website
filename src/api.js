const API_BASE = import.meta.env.VITE_API_BASE || "https://zerozero-api.gary-d56.workers.dev";

export async function getTips() {
  const res = await fetch(`${API_BASE}/tips`);
  return res.json();
}

export async function getOffers() {
  const res = await fetch(`${API_BASE}/offers`);
  return res.json();
}

export async function getResults() {
  const res = await fetch(`${API_BASE}/results`);
  return res.json();
}

export async function getLive() {
  const res = await fetch(`${API_BASE}/live`);
  return res.json();
}

export async function askZai(prompt) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}

