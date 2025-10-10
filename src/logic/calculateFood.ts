import { JourneyResult } from "./types";
import { FOOD_MEAL_KG } from "./utils/emissions";
import { getTips } from "./index";

type Inputs = {
  mealsPerDay?: number;       // default 2.5
  diet?: "beef"|"lamb"|"pork"|"poultry"|"fish"|"vegetarian"|"vegan";
  foodWastePercent?: number;  // 0..100
  meatFrequency?: string;
  foodWaste?: string;
};

export async function calculateFood(i: Inputs): Promise<JourneyResult> {
  const meals = i.mealsPerDay ?? 2.5;
  const diet = i.diet || "poultry";
  const base = FOOD_MEAL_KG[diet];
  const wasteMultiplier = 1 + (Math.max(0, i.foodWastePercent ?? 0) / 100) * 0.2; // waste penalty
  const carbonKgPerDay = meals * base * wasteMultiplier;

  const message = `your diet emits ~${carbonKgPerDay.toFixed(2)} kg CO₂e/day. reducing red meat or food waste can lower this quickly.`;

  return {
    category: "food",
    carbonKgPerDay,
    message,
    tips: await getTips("food"),
  };
}
