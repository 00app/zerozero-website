/**
 * Carbon Footprint Calculator
 * 
 * Computes user's carbon footprint based on profile answers
 * Uses standard emission factors and UK-based averages
 * 
 * TODO: Replace static emission factors with live data from codeWordAPI
 * - Energy: Use real-time grid carbon intensity (Carbon Interface API)
 * - Transport: Use vehicle-specific emission data (DEFRA database)
 * - Food: Use detailed food carbon database (Climate Change Food Calculator API)
 */

export interface FootprintBreakdown {
  home: { co2e: number; breakdown: any };
  travel: { co2e: number; commuteKm: number; mode: string };
  food: { co2e: number; diet: string; eatingOutAdj: number };
  shopping: { co2e: number; clothesPerMonth: number; deviceCycle: string };
  waste: { co2e: number; recycling: boolean; foodWaste: number };
  total: number;
}

export function computeFootprint(answers: any): FootprintBreakdown {
  // Home energy calculation
  const energyBill = parseFloat(answers.energyBill) || 0;
  const householdSize = answers.householdSize || 1;
  const greenTariff = answers.greenTariff === 'yes';
  
  // Convert monthly bill to annual kWh estimate (rough UK average £0.30/kWh)
  const annualKwh = (energyBill * 12) / 0.30;
  // UK grid average CO2e factor: ~0.23 kg/kWh
  let homeCo2e = annualKwh * 0.23;
  
  // Green tariff discount (only applies to electricity portion, ~60% of home energy)
  if (greenTariff) {
    homeCo2e = homeCo2e * 0.4 + (homeCo2e * 0.6 * 0.1); // 90% reduction on electricity
  }
  
  // Per capita adjustment
  homeCo2e = homeCo2e / householdSize;
  
  // Home type adjustment (efficiency factors)
  const homeTypeFactors = {
    'flat': 0.8,
    'terraced': 0.9,
    'semi': 1.0,
    'detached': 1.3
  };
  homeCo2e *= homeTypeFactors[answers.homeType] || 1.0;

  // Travel calculation
  const travelFrequency = answers.travelFrequency || 0;
  const travelDistance = answers.travelDistance || 0;
  const weeklyKm = travelFrequency * travelDistance * 2; // round trip
  
  // Transport mode factors (kg CO2e/km)
  const transportFactors = {
    'walk/cycle': 0,
    'bus': 0.1,
    'train': 0.04,
    'car (petrol)': 0.19,
    'car (diesel)': 0.21,
    'EV': 0.05,
    'none': 0
  };
  
  const travelCo2e = weeklyKm * 52 * (transportFactors[answers.transport] || 0);

  // Food calculation
  const dietFactors = {
    'vegan': 2.0,
    'veggie': 2.5,
    'pesc': 3.0,
    'mixed': 3.5,
    'meat-heavy': 5.0
  };
  
  const baseFoodCo2e = (dietFactors[answers.diet] || 3.5) * 365;
  const eatingOutAdj = (answers.eatingOut || 0) * 0.02; // 2% increase per meal out
  const foodCo2e = baseFoodCo2e * (1 + eatingOutAdj);

  // Shopping calculation
  const clothesPerMonth = answers.clothesShopping || 0;
  const clothingCo2e = clothesPerMonth * 12 * 15; // 15 kg CO2e per item

  // Device cycle calculation
  const deviceCycleFactors = {
    '<1y': 80, // very short cycle = high annual footprint
    '1–2y': 40,
    '3–4y': 20,
    '5y+': 12
  };
  const deviceCo2e = deviceCycleFactors[answers.deviceCycle] || 20;
  
  const shoppingCo2e = clothingCo2e + deviceCo2e;

  // Waste calculation
  const recycling = answers.recycling === 'yes';
  const foodWasteKg = (answers.foodWaste || 0) * 3; // 3kg per caddy per week
  
  let wasteCo2e = foodWasteKg * 52 * 2.5; // methane factor
  if (recycling) {
    wasteCo2e *= 0.9; // 10% reduction for recycling
  }

  const total = homeCo2e + travelCo2e + foodCo2e + shoppingCo2e + wasteCo2e;

  return {
    home: { 
      co2e: Math.round(homeCo2e),
      breakdown: { energyBill, householdSize, greenTariff }
    },
    travel: { 
      co2e: Math.round(travelCo2e),
      commuteKm: Math.round(weeklyKm * 52),
      mode: answers.transport
    },
    food: { 
      co2e: Math.round(foodCo2e),
      diet: answers.diet,
      eatingOutAdj: Math.round(eatingOutAdj * 100)
    },
    shopping: { 
      co2e: Math.round(shoppingCo2e),
      clothesPerMonth,
      deviceCycle: answers.deviceCycle
    },
    waste: { 
      co2e: Math.round(wasteCo2e),
      recycling,
      foodWaste: answers.foodWaste
    },
    total: Math.round(total)
  };
}