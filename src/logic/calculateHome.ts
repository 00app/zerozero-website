import { JourneyResult } from "./types";
import { ENERGY, kWhToKg } from "./utils/emissions";
import { getTips } from "./index";

type Inputs = {
  ledPercent?: number;         // 0..100
  draughtProofing?: boolean;
  dailyKwhDevicesStandby?: number; // estimated standby kWh/day
  homeSize?: string;
  heatingType?: string;
  insulation?: string;
};

export async function calculateHome(i: Inputs): Promise<JourneyResult> {
  const standbyKg = kWhToKg(i.dailyKwhDevicesStandby ?? 0.3);
  const ledGain = (i.ledPercent ?? 40) / 100 * 0.1; // rough daily reduction
  const draughtGain = i.draughtProofing ? 0.15 : 0;

  const carbonKgPerDay = Math.max(0, standbyKg - ledGain - draughtGain);

  const message = `home quick wins: you could cut ~${(ledGain + draughtGain).toFixed(2)} kg CO₂e/day with LEDs and sealing drafts.`;

  return {
    category: "home",
    carbonKgPerDay,
    message,
    tips: await getTips("home"),
  };
}
