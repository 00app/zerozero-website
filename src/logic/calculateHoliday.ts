import { JourneyResult } from "./types";
import { TRANS_KG_PER_KM } from "./utils/emissions";
import { getTips } from "./index";

type Inputs = {
  mode?: "flight_short"|"flight_long"|"train"|"car";
  tripKm?: number;
  nights?: number;
  tripsPerYear?: number;
  destination?: string;
  travelMode?: string;
};

export async function calculateHoliday(i: Inputs): Promise<JourneyResult> {
  const mode = i.mode || i.travelMode as any || "flight_short";
  const tripKm = i.tripKm || 500;
  const yearlyKg = tripKm * (TRANS_KG_PER_KM[mode] ?? 0) * (i.tripsPerYear ?? 1);
  const carbonKgPerDay = yearlyKg / 365;

  const message = `that holiday pattern averages ~${carbonKgPerDay.toFixed(2)} kg CO₂e/day across the year. trains often cut this massively.`;

  return {
    category: "holiday",
    carbonKgPerDay,
    message,
    tips: await getTips("holiday"),
  };
}
