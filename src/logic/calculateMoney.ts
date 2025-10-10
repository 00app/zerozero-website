import { JourneyResult } from "./types";
import { getTips } from "./index";

type Inputs = {
  monthlyDiscretionaryGBP?: number;
  usesGreenBank?: boolean;
  bankType?: string;
  spendingHabits?: string;
};

export async function calculateMoney(i: Inputs): Promise<JourneyResult> {
  const spend = i.monthlyDiscretionaryGBP ?? 300;
  const savingsPerMonthGBP = i.usesGreenBank ? 5 : 15; // placeholder "switch & save"
  const message = `track and trim non-essentials: potential saving ~£${savingsPerMonthGBP}/month. green banking reduces financed emissions.`;

  return {
    category: "money",
    savingsPerMonthGBP,
    message,
    tips: await getTips("money"),
  };
}
