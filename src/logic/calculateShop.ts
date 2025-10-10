import { JourneyResult } from "./types";
import { getTips } from "./index";

type Inputs = {
  purchasesPerMonth?: number;
  refurbishedShare?: number; // 0..1
  shoppingHabits?: string;
  productType?: string;
};

export async function calculateShop(i: Inputs): Promise<JourneyResult> {
  const purchases = i.purchasesPerMonth ?? 2;
  const refurb = i.refurbishedShare ?? 0;
  // crude: each new purchase causes 20 kg; refurbished halves it
  const monthlyKg = purchases * (20 * (1 - refurb) + 10 * refurb);
  const carbonKgPerDay = monthlyKg / 30;

  const message = `buy better: favour used/refurbished to reduce embedded emissions. your shopping footprint ~${carbonKgPerDay.toFixed(2)} kg CO₂e/day.`;

  return {
    category: "shop",
    carbonKgPerDay,
    message,
    tips: await getTips("shop"),
  };
}
