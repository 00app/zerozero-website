export type JourneyId =
  | "travel" | "switch" | "food" | "home" | "shop"
  | "waste" | "holiday" | "money" | "health";

export type JourneyResult = {
  category: JourneyId;
  carbonKgPerDay?: number;   // kg CO₂e/day
  carbonKg?: number;         // Total kg CO₂ (for compatibility)
  savingsPerMonthGBP?: number;
  moneySaved?: number;       // Total £ saved (for compatibility)
  waterSaved?: number;       // Litres of water saved
  message: string;
  tips: Array<{
    id: string;
    category: JourneyId;
    text: string;
    impact?: string;
    href?: string;
    type?: "learn" | "offer" | "product";
  }>;
};

export type CalcOptions = {
  useLive?: boolean; // force live even if no key
};

export type Dict<T = any> = Record<string, T>;
