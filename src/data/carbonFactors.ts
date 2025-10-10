/**
 * UK emission factors and conversion constants
 * Sources: UK DEFRA, Carbon Independent, Energy Saving Trust
 */

export const carbonFactors = {
  // Energy (kg CO₂ per kWh)
  electricity: 0.25,  // UK grid average 2024
  gas: 0.20,          // natural gas
  
  // Transport (kg CO₂ per mile)
  car: 0.21,          // average UK petrol car
  carDiesel: 0.23,
  carElectric: 0.05,
  bus: 0.10,
  train: 0.05,
  coach: 0.03,
  flight: 0.40,       // short-haul per mile
  flightLongHaul: 0.30,
  
  // Water (kg CO₂ per m³)
  water: 0.35,
  
  // Food (kg CO₂ per kg food)
  beef: 27.0,
  lamb: 24.0,
  cheese: 13.5,
  pork: 12.1,
  chicken: 6.9,
  fish: 6.1,
  eggs: 4.8,
  milk: 1.9,
  vegetables: 0.4,
  grains: 0.6,
  
  // Waste (kg CO₂ per kg waste)
  landfill: 0.5,
  recycling: 0.02,
  compost: 0.01,
} as const;

/**
 * Average UK household consumption (monthly)
 */
export const ukAverages = {
  electricityKwh: 200,      // ~2400 kWh/year
  gasKwh: 833,              // ~10,000 kWh/year
  waterM3: 5,               // ~60 m³/year
  wasteKg: 40,              // ~480 kg/year
  carMilesWeekly: 150,      // ~7800 miles/year
  foodSpendWeekly: 60,      // ~£3120/year
} as const;

/**
 * Cost savings estimates (£)
 */
export const savingsFactors = {
  // Per kWh saved
  electricitySaving: 0.30,
  gasSaving: 0.07,
  waterSavingPerM3: 1.50,
  
  // Per mile
  carCostPerMile: 0.35,
  busCostPerMile: 0.12,
  trainCostPerMile: 0.15,
  
  // Percentages
  dietSwitchSaving: 0.20,        // 20% potential food cost saving
  energyEfficiencySaving: 0.25,  // 25% with insulation/LED
  wasteSaving: 0.10,             // 10% with reduced waste
} as const;
