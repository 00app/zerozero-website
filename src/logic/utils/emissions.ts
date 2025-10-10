// Minimal client + local fallback factors (UK-ish averages)
// Free-first: uses CLIMATIQ when key present, otherwise local calc.

export const hasClimatiq = !!(import.meta.env?.VITE_CLIMATIQ_API_KEY);

export async function climatiqEstimate(body: any) {
  const key = import.meta.env?.VITE_CLIMATIQ_API_KEY;
  if (!key) return null;
  
  try {
    const res = await fetch("https://api.climatiq.io/data/v1/estimate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error('Climatiq API error:', e);
    return null;
  }
}

// ------ Local factors (simple, defensible, tweakable) ------
// transport (kg CO2e per km per passenger)
export const TRANS_KG_PER_KM = {
  car: 0.171,         // small petrol ~171 g/km
  bus: 0.105,
  train: 0.041,
  tram: 0.035,
  tube: 0.045,
  bike: 0,
  walk: 0,
  flight_short: 0.254, // short-haul average incl. RFI-lite
  flight_long: 0.195
};

// energy (kg CO2e per unit)
export const ENERGY = {
  electricityKgPerKWh: 0.193, // UK grid 2024-ish average
  gasKgPerKWh: 0.183,
};

// food (kg CO2e per meal rough medians)
export const FOOD_MEAL_KG = {
  beef: 5.0,
  lamb: 4.0,
  pork: 1.7,
  poultry: 1.2,
  fish: 1.3,
  vegetarian: 0.7,
  vegan: 0.5,
};

// waste (kg CO2e / day very rough deltas for behaviours)
export const WASTE_DELTAS = {
  goodRecycling: -0.3,
  composting:   -0.2,
  highPlastic:  +0.4
};

// device standby (kWh/day → kg/day)
export function kWhToKg(kwh: number) {
  return kwh * ENERGY.electricityKgPerKWh;
}

// helpers
export function perWeekToPerDay(x: number) { return x / 7; }
export function perMonthToPerDay(x: number) { return x / 30; }
