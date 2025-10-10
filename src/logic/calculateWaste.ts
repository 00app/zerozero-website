import { JourneyResult } from "./types";
import { WASTE_DELTAS } from "./utils/emissions";
import { getTips } from "./index";

type Inputs = {
  recyclesWell?: boolean;
  composts?: boolean;
  highPlasticUse?: boolean;
  wasteHabits?: string;
  recyclingFrequency?: string;
};

export async function calculateWaste(i: Inputs): Promise<JourneyResult> {
  let carbonKgPerDay = 0.6; // baseline waste footprint
  if (i.recyclesWell) carbonKgPerDay += WASTE_DELTAS.goodRecycling;
  if (i.composts)     carbonKgPerDay += WASTE_DELTAS.composting;
  if (i.highPlasticUse) carbonKgPerDay += WASTE_DELTAS.highPlastic;

  const message = `better sorting and composting can reduce your waste footprint to ~${Math.max(0, carbonKgPerDay).toFixed(2)} kg CO₂e/day.`;

  return {
    category: "waste",
    carbonKgPerDay: Math.max(0, carbonKgPerDay),
    message,
    tips: await getTips("waste"),
  };
}
