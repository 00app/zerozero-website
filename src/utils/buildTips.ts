import { FootprintBreakdown } from './computeFootprint';
import { UserLocation, getLocalizedTips } from './locationUtils';

/**
 * Personalized Tips Generator
 * 
 * Generates actionable tips based on user's footprint and behavior
 * 
 * TODO: Enhance with codeWordAPI integrations:
 * - Real-time energy tariff comparisons (uSwitch/MoneySuperMarket API)
 * - Location-specific public transport options (Google Maps Directions API)
 * - Local food rescue app availability (Too Good To Go API)
 * - Regional grant/incentive programs (government APIs)
 * - Personalized product recommendations (sustainability databases)
 */

export interface Tip {
  id: string;
  title: string;
  body: string;
  estMoneyPerYear: number;
  estCo2ePerYear: number;
  category: string;
}

export function buildTips(answers: any, footprint: FootprintBreakdown, userLocation?: UserLocation | null): Tip[] {
  const tips: Tip[] = [];
  const localizedData = getLocalizedTips(userLocation);

  // Home tips
  if (['gas', 'oil'].includes(answers.heating)) {
    tips.push({
      id: 'flow-temp',
      title: 'turn down flow temperature to 55°C',
      body: 'lower boiler flow temperature reduces gas use without affecting comfort',
      estMoneyPerYear: Math.round(footprint.home.breakdown.energyBill * 12 * 0.07),
      estCo2ePerYear: Math.round(footprint.home.co2e * 0.07),
      category: 'home'
    });
  }

  if (answers.greenTariff === 'no') {
    tips.push({
      id: 'green-tariff',
      title: `switch to ${localizedData.energyProvider}`,
      body: 'similar cost but much lower carbon footprint',
      estMoneyPerYear: 0,
      estCo2ePerYear: Math.round(footprint.home.co2e * 0.5),
      category: 'home'
    });
  }

  if ((answers.energyBill || 0) > 120) {
    tips.push({
      id: 'insulation',
      title: 'check loft insulation top-up',
      body: 'costs £300-500 but saves £200+ per year',
      estMoneyPerYear: 200,
      estCo2ePerYear: Math.round(footprint.home.co2e * 0.15),
      category: 'home'
    });
  }

  // Travel tips
  if (['car (petrol)', 'car (diesel)'].includes(answers.transport) && footprint.travel.commuteKm > 1000) {
    tips.push({
      id: 'commute-mix',
      title: `try 1 commute per week by ${localizedData.transportMode}`,
      body: `save ${Math.round(footprint.travel.commuteKm * 0.15 / 52)} kg CO₂ per week`,
      estMoneyPerYear: Math.round(footprint.travel.commuteKm * 0.15 * 0.5), // fuel savings
      estCo2ePerYear: Math.round(footprint.travel.co2e * 0.2),
      category: 'travel'
    });
  }

  if (answers.transport === 'EV') {
    tips.push({
      id: 'ev-charging',
      title: 'charge off-peak with green tariff',
      body: 'smart charging can halve electricity costs and carbon',
      estMoneyPerYear: Math.round(footprint.travel.commuteKm * 0.05 * 0.5),
      estCo2ePerYear: Math.round(footprint.travel.co2e * 0.3),
      category: 'travel'
    });
  }

  if (answers.longTrip === 'yes') {
    tips.push({
      id: 'long-trip',
      title: 'check rail vs air for your long trip',
      body: 'trains often cheaper and always much lower carbon',
      estMoneyPerYear: 200,
      estCo2ePerYear: 500,
      category: 'travel'
    });
  }

  // Food tips
  if (['meat-heavy', 'mixed'].includes(answers.diet)) {
    tips.push({
      id: 'meat-free',
      title: '2 meat-free days per week',
      body: 'swap beef for chicken or vegetarian options',
      estMoneyPerYear: 150,
      estCo2ePerYear: Math.round(footprint.food.co2e * 0.15),
      category: 'food'
    });
  }

  if ((answers.eatingOut || 0) > 3) {
    tips.push({
      id: 'batch-cook',
      title: 'batch cook one night per week',
      body: 'replace takeaways with home cooking',
      estMoneyPerYear: 400,
      estCo2ePerYear: Math.round(footprint.food.co2e * 0.1),
      category: 'food'
    });
  }

  // Shopping tips
  if ((answers.clothesShopping || 0) > 2) {
    tips.push({
      id: 'second-hand',
      title: '1 second-hand swap per month',
      body: 'charity shops and vinted for quality items',
      estMoneyPerYear: Math.round(answers.clothesShopping * 12 * 15),
      estCo2ePerYear: Math.round(footprint.shopping.co2e * 0.3),
      category: 'shopping'
    });
  }

  if (['<1y', '1–2y'].includes(answers.deviceCycle)) {
    tips.push({
      id: 'device-longevity',
      title: 'stretch phone to 3 years',
      body: 'use a good case and avoid unnecessary upgrades',
      estMoneyPerYear: 300,
      estCo2ePerYear: Math.round(footprint.shopping.co2e * 0.4),
      category: 'shopping'
    });
  }

  // Waste tips
  if (answers.recycling === 'no') {
    tips.push({
      id: 'recycling',
      title: `start using ${localizedData.recyclingService}`,
      body: 'check your local authority website for collection info',
      estMoneyPerYear: 0,
      estCo2ePerYear: Math.round(footprint.waste.co2e * 0.2),
      category: 'waste'
    });
  }

  if ((answers.foodWaste || 0) > 2) {
    tips.push({
      id: 'food-waste',
      title: 'plan meals and shop smaller',
      body: 'reduce food waste with weekly meal planning',
      estMoneyPerYear: 200,
      estCo2ePerYear: Math.round(footprint.waste.co2e * 0.5),
      category: 'waste'
    });
  }

  return tips;
}