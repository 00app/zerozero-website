export * from "./types";
export { calculateTravel } from "./calculateTravel";
export { calculateSwitch } from "./calculateSwitch";
export { calculateFood } from "./calculateFood";
export { calculateHome } from "./calculateHome";
export { calculateShop } from "./calculateShop";
export { calculateWaste } from "./calculateWaste";
export { calculateHoliday } from "./calculateHoliday";
export { calculateMoney } from "./calculateMoney";
export { calculateHealth } from "./calculateHealth";

// Export new services and utilities
export * from "./storage";
export * from "./tipsFeed";

export async function getTips(category: any) {
  const data = (await import("../data/tips.json")).default as any[];
  return data.filter(d => d.category === category);
}

export async function runJourney(id: string, inputs: any) {
  const { calculateTravel } = await import("./calculateTravel");
  const { calculateSwitch } = await import("./calculateSwitch");
  const { calculateFood } = await import("./calculateFood");
  const { calculateHome } = await import("./calculateHome");
  const { calculateShop } = await import("./calculateShop");
  const { calculateWaste } = await import("./calculateWaste");
  const { calculateHoliday } = await import("./calculateHoliday");
  const { calculateMoney } = await import("./calculateMoney");
  const { calculateHealth } = await import("./calculateHealth");

  switch (id) {
    case "travel":  return calculateTravel(inputs);
    case "switch":  return calculateSwitch(inputs);
    case "food":    return calculateFood(inputs);
    case "home":    return calculateHome(inputs);
    case "shop":    return calculateShop(inputs);
    case "waste":   return calculateWaste(inputs);
    case "holiday": return calculateHoliday(inputs);
    case "money":   return calculateMoney(inputs);
    case "health":  return calculateHealth(inputs);
    default: throw new Error(`Unknown journey: ${id}`);
  }
}
