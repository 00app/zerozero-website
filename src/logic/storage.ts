/**
 * Local storage utilities for Zero Zero
 * Handles likes, journey results, and user preferences
 */

import type { JourneyResult } from './types';

const STORAGE_KEYS = {
  LIKES: 'zz-likes',
  RESULTS: 'zz-results',
  USER_PREFS: 'zz-prefs',
  LIKED_RESULTS: 'zz-liked-results',
} as const;

/**
 * Toggle like status for a tip or result
 * @param id - Unique identifier for the item
 * @returns Updated array of liked IDs
 */
export function toggleLike(id: string): string[] {
  const likes = getLikes();
  const newLikes = likes.includes(id)
    ? likes.filter((x: string) => x !== id)
    : [...likes, id];
  
  localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(newLikes));
  return newLikes;
}

/**
 * Get all liked item IDs
 */
export function getLikes(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LIKES);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading likes:', e);
    return [];
  }
}

/**
 * Check if an item is liked
 */
export function isLiked(id: string): boolean {
  return getLikes().includes(id);
}

/**
 * Save journey result to localStorage
 */
export function saveJourneyResult(journey: string, data: JourneyResult): void {
  try {
    const allResults = getAllJourneyResults();
    allResults[journey] = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(allResults));
  } catch (e) {
    console.error('Error saving journey result:', e);
  }
}

/**
 * Get result for a specific journey
 */
export function getJourneyResult(journey: string): JourneyResult | null {
  try {
    const allResults = getAllJourneyResults();
    return allResults[journey] || null;
  } catch (e) {
    console.error('Error loading journey result:', e);
    return null;
  }
}

/**
 * Get all journey results
 */
export function getAllJourneyResults(): Record<string, JourneyResult & { timestamp?: number }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Error loading all journey results:', e);
    return {};
  }
}

/**
 * Clear old journey results (older than 30 days)
 */
export function clearOldResults(): void {
  try {
    const allResults = getAllJourneyResults();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    const filtered = Object.entries(allResults).reduce((acc, [journey, result]) => {
      if (!result.timestamp || result.timestamp > thirtyDaysAgo) {
        acc[journey] = result;
      }
      return acc;
    }, {} as Record<string, any>);
    
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error clearing old results:', e);
  }
}

/**
 * Save user preferences
 */
export function saveUserPrefs(prefs: Record<string, any>): void {
  try {
    const existing = getUserPrefs();
    const updated = { ...existing, ...prefs };
    localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving user prefs:', e);
  }
}

/**
 * Get user preferences
 */
export function getUserPrefs(): Record<string, any> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFS);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Error loading user prefs:', e);
    return {};
  }
}

/**
 * Get total impact across all journeys
 */
export function getTotalImpact(): {
  totalCarbon: number;
  totalSavings: number;
  journeyCount: number;
} {
  const results = getAllJourneyResults();
  const values = Object.values(results);
  
  return {
    totalCarbon: values.reduce((sum, r) => sum + (r.carbonKg || 0), 0),
    totalSavings: values.reduce((sum, r) => sum + (r.moneySaved || 0), 0),
    journeyCount: values.length,
  };
}

/**
 * Export all user data (for GDPR compliance)
 */
export function exportUserData(): {
  likes: string[];
  results: Record<string, any>;
  prefs: Record<string, any>;
  exportDate: string;
} {
  return {
    likes: getLikes(),
    results: getAllJourneyResults(),
    prefs: getUserPrefs(),
    exportDate: new Date().toISOString(),
  };
}

/**
 * Clear all user data
 */
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
