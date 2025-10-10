import { JourneyResult } from "./types";
import { climatiqEstimate, TRANS_KG_PER_KM, perWeekToPerDay } from "./utils/emissions";
import { getTips } from "./index";

type Inputs = {
  mode?: "car"|"bus"|"train"|"tram"|"tube"|"bike"|"walk"|"flight_short"|"flight_long";
  kmPerWeek?: number;
  distance?: number;
  from?: string;
  to?: string;
};

export async function calculateTravel(inputs: Inputs): Promise<JourneyResult> {
  const mode = inputs.mode || "car";
  const kmPerWeek = inputs.kmPerWeek || inputs.distance || 0;
  const kmPerDay = perWeekToPerDay(kmPerWeek);

  let carbonKgPerDay = kmPerDay * (TRANS_KG_PER_KM[mode] ?? 0);

  // Optional: try Climatiq for more precise factors when available (car example)
  if (mode === "car") {
    const est = await climatiqEstimate({
      emission_factor: { 
        activity_id: "passenger_vehicle-vehicle_type_car-fuel_source_petrol-engine_size_medium", 
        region: "GB" 
      },
      parameters: { distance: kmPerDay, distance_unit: "km" }
    });
    const co2e = est?.co2e;
    if (co2e != null) carbonKgPerDay = co2e;
  }

  const msg = mode === "car"
    ? `your daily car travel emits ~${carbonKgPerDay.toFixed(2)} kg CO₂e. swap one short trip for walking or cycling to cut ~0.3 kg.`
    : `your daily ${mode} travel emits ~${carbonKgPerDay.toFixed(2)} kg CO₂e.`;

  return {
    category: "travel",
    carbonKgPerDay,
    message: msg,
    tips: await getTips("travel"),
  };
}
