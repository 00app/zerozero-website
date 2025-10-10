/**
 * Zero Zero API Service
 * 
 * Unified API layer connecting to Cloudflare Worker endpoints.
 * All functions include fallback logic for offline operation.
 * 
 * Environment variables required:
 * - VITE_API_BASE_URL: Cloudflare Worker base URL
 * - VITE_HF_API_KEY: Hugging Face API key (optional)
 */

// API Configuration
// Safe access to environment variables (handles cases where import.meta.env might be undefined)
export const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '';
const HF_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_HF_API_KEY) || '';
const HF_API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_HF_API_URL) || 'https://api-inference.huggingface.co/models/distilgpt2';

// Type definitions
export interface Tip {
  id: string;
  category: string;
  text: string;
  impact: string;
  carbonSaving?: number;
  moneySaving?: number;
}

export interface Offer {
  id: string;
  journey: string;
  title: string;
  provider: string;
  description: string;
  url: string;
  carbonSaving?: number;
  moneySaving?: number;
}

export interface JourneyResult {
  journey: string;
  carbonKg: number;
  moneySaved: number;
  results: Array<{
    title: string;
    provider: string;
    price: string;
    carbon: string;
    rationale: string;
    cta: string;
    href: string;
  }>;
  tips?: Tip[];
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  location: string;
}

export interface AirQualityData {
  aqi: number;
  quality: string;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
  };
}

export interface Place {
  name: string;
  address: string;
  type: string;
  distance?: number;
  url?: string;
}

/**
 * Fetch tips from Worker API or return local fallback
 */
export const getTips = async (): Promise<Tip[]> => {
  if (!API_BASE) {
    console.log('No API base URL - using local tips');
    return getLocalTips();
  }

  try {
    const res = await fetch(`${API_BASE}/tips`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.tips || getLocalTips();
  } catch (error) {
    console.error('Error fetching tips:', error);
    return getLocalTips();
  }
};

/**
 * Fetch offers for a specific journey
 */
export const getOffers = async (journey: string): Promise<Offer[]> => {
  if (!API_BASE) {
    console.log('No API base URL - using local offers');
    return getLocalOffers(journey);
  }

  try {
    const res = await fetch(`${API_BASE}/offers?journey=${encodeURIComponent(journey)}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.offers || getLocalOffers(journey);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return getLocalOffers(journey);
  }
};

/**
 * Get journey results from Worker API or calculate locally
 */
export const getJourneyResults = async (
  id: string,
  params: Record<string, string | number>
): Promise<JourneyResult | null> => {
  if (!API_BASE) {
    console.log('No API base URL - using local calculations');
    return null; // Let local logic system handle it
  }

  try {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    );
    
    const res = await fetch(`${API_BASE}/journey/${id}/results?${qs}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.result || null;
  } catch (error) {
    console.error('Error fetching journey results:', error);
    return null;
  }
};

/**
 * Chat with Zai using Hugging Face API
 */
export const askZai = async (prompt: string): Promise<ChatResponse> => {
  // Try Worker API first
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          response: data.response || data.text || '',
          suggestions: data.suggestions || [],
        };
      }
    } catch (error) {
      console.log('Worker chat unavailable, trying Hugging Face...');
    }
  }

  // Fallback to direct Hugging Face API
  if (HF_API_KEY) {
    try {
      const res = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data[0]?.generated_text || data.generated_text || '';
        return {
          response: text.trim(),
          suggestions: [],
        };
      }
    } catch (error) {
      console.error('Hugging Face API error:', error);
    }
  }

  // Final fallback to local responses
  return getLocalChatResponse(prompt);
};

/**
 * Get weather data for location
 */
export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  if (!API_BASE) {
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.weather || null;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

/**
 * Get air quality data for location
 */
export const getAir = async (lat: number, lon: number): Promise<AirQualityData | null> => {
  if (!API_BASE) {
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/air?lat=${lat}&lon=${lon}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.airQuality || null;
  } catch (error) {
    console.error('Error fetching air quality:', error);
    return null;
  }
};

/**
 * Search for sustainable places near location
 */
export const getPlaces = async (
  q: string,
  lat: number,
  lon: number
): Promise<Place[]> => {
  if (!API_BASE) {
    return [];
  }

  try {
    const res = await fetch(
      `${API_BASE}/places?q=${encodeURIComponent(q)}&lat=${lat}&lon=${lon}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.places || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

// ============================================================================
// LOCAL FALLBACK FUNCTIONS (Offline Operation)
// ============================================================================

function getLocalTips(): Tip[] {
  return [
    {
      id: 'tip-1',
      category: 'travel',
      text: 'walk or cycle for journeys under 2 miles',
      impact: 'saves 120kg co₂/year',
      carbonSaving: 120,
      moneySaving: 0,
    },
    {
      id: 'tip-2',
      category: 'home',
      text: 'turn heating down 1°c to save 10%',
      impact: 'saves £60/year',
      carbonSaving: 0,
      moneySaving: 60,
    },
    {
      id: 'tip-3',
      category: 'food',
      text: 'try one meat-free day per week',
      impact: 'saves 300kg co₂/year',
      carbonSaving: 300,
      moneySaving: 0,
    },
  ];
}

function getLocalOffers(journey: string): Offer[] {
  const offers: Record<string, Offer[]> = {
    travel: [
      {
        id: 'offer-travel-1',
        journey: 'travel',
        title: 'trainline discount',
        provider: 'trainline',
        description: '10% off rail tickets',
        url: 'https://www.thetrainline.com/',
        carbonSaving: 50,
        moneySaving: 15,
      },
    ],
    switch: [
      {
        id: 'offer-switch-1',
        journey: 'switch',
        title: 'octopus referral',
        provider: 'octopus energy',
        description: '£50 credit for switching',
        url: 'https://octopus.energy/',
        moneySaving: 50,
      },
    ],
  };

  return offers[journey] || [];
}

function getLocalChatResponse(prompt: string): ChatResponse {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('travel') || lowerPrompt.includes('transport')) {
    return {
      response: 'i can help you find greener travel options. walking and cycling are great for short trips, while trains beat flying for longer journeys.',
      suggestions: ['compare transport', 'find routes', 'calculate savings'],
    };
  }

  if (lowerPrompt.includes('energy') || lowerPrompt.includes('switch')) {
    return {
      response: 'switching to a green energy tariff is one of the biggest carbon cuts you can make. i can help you compare providers.',
      suggestions: ['compare tariffs', 'find deals', 'check savings'],
    };
  }

  if (lowerPrompt.includes('food') || lowerPrompt.includes('diet')) {
    return {
      response: 'food choices have a huge impact. plant-based meals, local produce, and reducing waste all help.',
      suggestions: ['meal plans', 'recipes', 'waste tips'],
    };
  }

  return {
    response: "i'm here to help you save money and reduce your carbon footprint. what would you like to explore?",
    suggestions: ['travel options', 'energy switch', 'food choices', 'home efficiency'],
  };
}
