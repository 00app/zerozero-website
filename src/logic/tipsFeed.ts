/**
 * Central tips feed logic
 * Combines static tips, AI-generated tips, and location-based recommendations
 */

import { findGreenPlaces } from '../services/maps';
import { generateQuickTips } from '../services/ai';
import tipsData from '../data/tips.json';

export interface TipItem {
  id: string;
  category: string;
  text: string;
  impact?: string;
  href?: string;
  source?: 'static' | 'ai' | 'location';
}

/**
 * Get comprehensive tips feed combining all sources
 * @param lat - User's latitude (optional)
 * @param lon - User's longitude (optional)
 * @param journey - Current journey context (optional)
 * @returns Array of tip items
 */
export async function getFullTipsFeed(
  lat?: number,
  lon?: number,
  journey?: string
): Promise<TipItem[]> {
  const combined: TipItem[] = [];

  // 1. Add static tips from JSON
  const staticTips = getStaticTips(journey);
  combined.push(...staticTips);

  // 2. Add AI-generated tips (if available)
  try {
    const context = journey 
      ? `${journey} sustainability tips`
      : 'sustainable living tips';
    const aiTips = await generateQuickTips(context);
    const aiTipItems = aiTips.map((text, i) => ({
      id: `ai-${i}-${Date.now()}`,
      category: 'ai',
      text,
      source: 'ai' as const,
    }));
    combined.push(...aiTipItems);
  } catch (error) {
    console.error('Error generating AI tips:', error);
  }

  // 3. Add location-based recommendations (if coordinates provided)
  if (lat !== undefined && lon !== undefined) {
    try {
      const places = await findGreenPlaces(lat, lon);
      const placeTips = places.map((place, i) => ({
        id: `place-${i}-${Date.now()}`,
        category: 'location',
        text: place.name,
        impact: place.address,
        href: place.mapsUrl,
        source: 'location' as const,
      }));
      combined.push(...placeTips);
    } catch (error) {
      console.error('Error fetching green places:', error);
    }
  }

  // Shuffle to mix sources
  return shuffleArray(combined);
}

/**
 * Get static tips from JSON, optionally filtered by journey
 */
function getStaticTips(journey?: string): TipItem[] {
  const tips = tipsData as any[];
  
  let filtered = tips;
  if (journey) {
    // Filter tips relevant to the journey
    filtered = tips.filter(tip => 
      tip.category === journey || 
      tip.category === 'general' ||
      !tip.category
    );
  }

  return filtered.map((tip, i) => ({
    id: `tip-${i}`,
    category: tip.category || 'general',
    text: tip.text || tip.title || '',
    impact: tip.impact || tip.description || '',
    href: tip.href || tip.link,
    source: 'static' as const,
  }));
}

/**
 * Get tips for a specific category
 */
export function getTipsByCategory(category: string): TipItem[] {
  return getStaticTips(category);
}

/**
 * Get journey-specific tips based on user's answers and results
 */
export async function getJourneySpecificTips(
  journey: string,
  answers: Record<string, any>,
  results: { carbonKg: number; moneySaved: number }
): Promise<TipItem[]> {
  const tips: TipItem[] = [];

  // Add contextual tips based on journey type
  const contextTips = getContextualTips(journey, answers, results);
  tips.push(...contextTips);

  // Add AI tips with context
  try {
    const context = buildAIContext(journey, answers, results);
    const aiTips = await generateQuickTips(context);
    const aiTipItems = aiTips.map((text, i) => ({
      id: `ai-journey-${i}-${Date.now()}`,
      category: journey,
      text,
      source: 'ai' as const,
    }));
    tips.push(...aiTipItems);
  } catch (error) {
    console.error('Error generating journey-specific AI tips:', error);
  }

  return tips;
}

/**
 * Build AI context from journey data
 */
function buildAIContext(
  journey: string,
  answers: Record<string, any>,
  results: { carbonKg: number; moneySaved: number }
): string {
  const parts = [journey];
  
  if (results.carbonKg > 0) {
    parts.push(`${results.carbonKg}kg CO2`);
  }
  
  if (results.moneySaved > 0) {
    parts.push(`save £${results.moneySaved}`);
  }
  
  return parts.join(' - ') + ' tips';
}

/**
 * Get contextual tips based on journey answers
 */
function getContextualTips(
  journey: string,
  answers: Record<string, any>,
  results: { carbonKg: number; moneySaved: number }
): TipItem[] {
  const tips: TipItem[] = [];

  // High impact alert
  if (results.carbonKg > 100) {
    tips.push({
      id: 'high-impact-alert',
      category: journey,
      text: 'your impact is above average',
      impact: 'small changes can make a big difference',
      source: 'static',
    });
  }

  // Journey-specific contextual tips
  if (journey === 'travel' && answers.mode === 'car') {
    tips.push({
      id: 'travel-car-tip',
      category: 'travel',
      text: 'consider car-sharing or public transport',
      impact: 'could save £60/month and 50kg CO2',
      source: 'static',
    });
  }

  if (journey === 'food' && answers.diet === 'meat-heavy') {
    tips.push({
      id: 'food-meat-tip',
      category: 'food',
      text: 'try meat-free monday',
      impact: 'saves 8kg CO2 per week',
      source: 'static',
    });
  }

  return tips;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get daily tip (rotates through static tips)
 */
export function getDailyTip(): TipItem | null {
  const tips = getStaticTips();
  if (tips.length === 0) return null;
  
  // Use day of year to rotate tips
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % tips.length;
  
  return tips[index];
}
