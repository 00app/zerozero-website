import { JourneyResult } from "./types";
import { ENERGY } from "./utils/emissions";
import { getTips } from "./index";

type Inputs = {
  monthlyKWhElectric?: number;
  monthlyKWhGas?: number;
  tariffGBPPerKWhElectric?: number; // e.g. £0.28
  tariffGBPPerKWhGas?: number;      // e.g. £0.08
  greenSupplier?: boolean;
  currentProvider?: string;
  energyUsage?: string;
};

export async function calculateSwitch(i: Inputs): Promise<JourneyResult> {
  const elecKWh = i.monthlyKWhElectric || 300; // UK average ~300 kWh/month
  const gasKWh = i.monthlyKWhGas || 0;
  
  const elecKgDay = elecKWh * ENERGY.electricityKgPerKWh / 30;
  const gasKgDay = gasKWh * ENERGY.gasKgPerKWh / 30;
  const carbonKgPerDay = elecKgDay + gasKgDay;

  const monthlyCost =
    elecKWh * (i.tariffGBPPerKWhElectric ?? 0.28) +
    gasKWh * (i.tariffGBPPerKWhGas ?? 0.08);

  const potentialSaving = i.greenSupplier ? 0 : 10; // rough placeholder
  const message = `your home energy emits ~${carbonKgPerDay.toFixed(2)} kg CO₂e/day. consider a green tariff and LED upgrades. est. saving £${potentialSaving}/month.`;

  return {
    category: "switch",
    carbonKgPerDay,
    savingsPerMonthGBP: potentialSaving,
    message,
    tips: await getTips("switch"),
  };
}
