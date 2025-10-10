/**
 * AI-powered tips using Hugging Face Inference API
 * Free tier: 30,000 characters/month
 * Falls back to static tips if no API key or quota exceeded
 */

/**
 * Generate contextual sustainability tips using AI
 * Uses Hugging Face's free inference API with Mistral model
 */
export async function generateQuickTips(context: string): Promise<string[]> {
  // Check for API key in environment
  const key = import.meta.env.VITE_HF_API_KEY;
  
  if (!key) {
    console.log('No Hugging Face API key - using static tips');
    return getStaticTips(context);
  }

  try {
    const prompt = `Give me 3 short, actionable tips (max 10 words each) about: ${context}. Format: numbered list.`;
    
    const res = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
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
      }
    );

    if (!res.ok) {
      throw new Error(`HF API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data[0]?.generated_text || '';
    
    // Parse numbered list from response
    const tips = text
      .split(/\n/)
      .filter((line: string) => /^\d+\./.test(line.trim()))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((tip: string) => tip.length > 5 && tip.length < 100)
      .slice(0, 3);

    return tips.length >= 2 ? tips : getStaticTips(context);
  } catch (error) {
    console.error('Error generating AI tips:', error);
    return getStaticTips(context);
  }
}

/**
 * Fallback static tips based on context
 */
function getStaticTips(context: string): string[] {
  const lowerContext = context.toLowerCase();
  
  if (lowerContext.includes('travel') || lowerContext.includes('transport')) {
    return [
      'walk or cycle for journeys under 2 miles',
      'combine trips to reduce total mileage',
      'use public transport for longer journeys',
    ];
  }
  
  if (lowerContext.includes('food') || lowerContext.includes('diet')) {
    return [
      'try one meat-free day per week',
      'buy seasonal vegetables from local markets',
      'plan meals to reduce food waste',
    ];
  }
  
  if (lowerContext.includes('home') || lowerContext.includes('energy')) {
    return [
      'switch to LED bulbs throughout your home',
      'turn heating down by 1°c to save 10%',
      'unplug devices when not in use',
    ];
  }
  
  if (lowerContext.includes('shop') || lowerContext.includes('clothes')) {
    return [
      'buy second-hand before buying new',
      'repair items instead of replacing them',
      'choose quality over quantity',
    ];
  }
  
  if (lowerContext.includes('waste') || lowerContext.includes('recycling')) {
    return [
      'start composting food scraps',
      'use reusable bags and bottles',
      'check if items can be recycled first',
    ];
  }
  
  if (lowerContext.includes('money') || lowerContext.includes('save')) {
    return [
      'switch to a cheaper energy tariff',
      'track your spending for one month',
      'cancel unused subscriptions',
    ];
  }
  
  // Generic sustainable living tips
  return [
    'choose low-carbon options when possible',
    'reuse and repair before buying new',
    'track your progress for motivation',
  ];
}

/**
 * Generate personalized tips based on journey results
 */
export async function generateJourneyTips(
  journey: string,
  answers: Record<string, any>,
  results: { carbonKg: number; moneySaved: number }
): Promise<string[]> {
  const context = `${journey} sustainability for someone with ${results.carbonKg}kg CO2 footprint`;
  return generateQuickTips(context);
}
