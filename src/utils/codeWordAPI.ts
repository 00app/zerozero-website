/**
 * codeWordAPI - Centralized Mock API Layer
 * 
 * This file provides mock data for all external API interactions.
 * When deploying to production, replace these functions with real API calls.
 * 
 * API Categories:
 * - Chat/AI (OpenAI GPT)
 * - Location Services (Google Maps, IP Geolocation)
 * - Travel Booking (Flight/Train APIs)
 * - Energy Comparison (Supplier APIs)
 * - Environmental Data (Carbon APIs)
 * - User Authentication (Supabase/Auth0)
 * - Data Persistence (Supabase/Firebase)
 */

// =====================================================
// CHAT & AI ASSISTANT
// =====================================================

/**
 * TODO: Replace with OpenAI GPT-4 API call
 * @param userMessage - User's chat input
 * @returns AI-generated response with suggestions and actions
 */
export async function codeWordAPI_chatResponse(userMessage: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const text = userMessage.toLowerCase();
  
  // Mock intent classification and response generation
  if (text.includes('travel') || text.includes('train') || text.includes('flight')) {
    return {
      type: 'zai',
      label: 'suggestion',
      copy: 'trains cut co2 by 90% vs flights and coaches are usually cheapest. book direct for best deals.',
      actions: [
        { label: 'book train', href: 'https://www.eurostar.com/' },
        { label: 'book coach', href: 'https://www.flixbus.co.uk/' },
        { label: 'compare flights', href: 'https://www.skyscanner.net/' }
      ]
    };
  }
  
  if (text.includes('energy') || text.includes('bill') || text.includes('switch')) {
    return {
      type: 'zai',
      label: 'tip',
      copy: 'switching energy supplier takes 5 minutes and saves 300 pounds per year on average. start with price comparison.',
      actions: [
        { label: 'compare prices', href: 'https://energycompare.citizensadvice.org.uk/' },
        { label: 'switch now', href: 'https://www.zen.co.uk/' },
        { label: 'green energy', href: 'https://www.triodos.co.uk/' }
      ]
    };
  }

  // Default fallback
  return {
    type: 'zai',
    label: 'response',
    copy: 'tell me what you want to save money on or ask about reducing carbon in your daily life.',
    actions: []
  };
}

// =====================================================
// LOCATION & GEOCODING
// =====================================================

/**
 * TODO: Replace with Google Maps Geocoding API
 * @param address - Location string (e.g., "London", "Paris, France")
 * @returns Latitude, longitude, and formatted address
 */
export async function codeWordAPI_geocodeLocation(address: string) {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Mock geocoding data
  const mockLocations = {
    'london': { lat: 51.5074, lng: -0.1278, formatted: 'London, UK' },
    'paris': { lat: 48.8566, lng: 2.3522, formatted: 'Paris, France' },
    'berlin': { lat: 52.5200, lng: 13.4050, formatted: 'Berlin, Germany' },
    'amsterdam': { lat: 52.3676, lng: 4.9041, formatted: 'Amsterdam, Netherlands' },
    'manchester': { lat: 53.4808, lng: -2.2426, formatted: 'Manchester, UK' }
  };

  const key = address.toLowerCase();
  for (const [city, data] of Object.entries(mockLocations)) {
    if (key.includes(city)) {
      return data;
    }
  }

  // Default fallback
  return { lat: 51.5074, lng: -0.1278, formatted: address };
}

/**
 * TODO: Replace with browser geolocation + reverse geocoding
 * @returns User's current location with country/region info
 */
export async function codeWordAPI_getUserLocation() {
  // This still uses browser geolocation which is client-side
  // The API replacement would be for reverse geocoding the coords
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            country: 'UK', // TODO: Replace with reverse geocoding API
            region: 'United Kingdom'
          });
        },
        () => {
          // Return default location if denied
          resolve({
            latitude: 51.5074,
            longitude: -0.1278,
            country: 'UK',
            region: 'United Kingdom'
          });
        }
      );
    } else {
      resolve({
        latitude: 51.5074,
        longitude: -0.1278,
        country: 'UK',
        region: 'United Kingdom'
      });
    }
  });
}

/**
 * TODO: Replace with IP Geolocation API (ipapi.co, ipgeolocation.io)
 * @returns Country/region from user's IP address
 */
export async function codeWordAPI_getCountryFromIP() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    country_code: 'UK',
    country_name: 'United Kingdom',
    region: 'England',
    city: 'London',
    currency: 'GBP'
  };
}

// =====================================================
// TRAVEL & BOOKING
// =====================================================

/**
 * TODO: Replace with Skyscanner/Kiwi.com Flight Search API
 * @param from - Origin location
 * @param to - Destination location
 * @param date - Travel date
 * @param passengers - Number of travelers
 * @returns Flight options with prices and carbon data
 */
export async function codeWordAPI_searchFlights(from: string, to: string, date: string, passengers: number) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      airline: 'ryanair',
      price: 60 * passengers,
      carbon: 120 * passengers,
      duration: '1h 30m',
      departure: '08:00',
      arrival: '09:30'
    },
    {
      airline: 'easyjet',
      price: 75 * passengers,
      carbon: 115 * passengers,
      duration: '1h 25m',
      departure: '14:00',
      arrival: '15:25'
    }
  ];
}

/**
 * TODO: Replace with Trainline/Rail Europe API
 * @param from - Origin station
 * @param to - Destination station
 * @param date - Travel date
 * @param passengers - Number of travelers
 * @returns Train options with prices and carbon data
 */
export async function codeWordAPI_searchTrains(from: string, to: string, date: string, passengers: number) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      operator: 'eurostar',
      price: 49 * passengers,
      carbon: 2 * passengers,
      duration: '2h 15m',
      departure: '10:00',
      arrival: '12:15'
    },
    {
      operator: 'avanti west coast',
      price: 35 * passengers,
      carbon: 5 * passengers,
      duration: '2h 45m',
      departure: '11:30',
      arrival: '14:15'
    }
  ];
}

/**
 * TODO: Replace with FlixBus/National Express API
 * @param from - Origin location
 * @param to - Destination location
 * @param date - Travel date
 * @param passengers - Number of travelers
 * @returns Coach/bus options with prices and carbon data
 */
export async function codeWordAPI_searchCoaches(from: string, to: string, date: string, passengers: number) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      operator: 'flixbus',
      price: 25 * passengers,
      carbon: 9 * passengers,
      duration: '7h 30m',
      departure: '22:00',
      arrival: '05:30'
    },
    {
      operator: 'national express',
      price: 30 * passengers,
      carbon: 10 * passengers,
      duration: '8h 00m',
      departure: '23:30',
      arrival: '07:30'
    }
  ];
}

// =====================================================
// ENERGY & UTILITIES
// =====================================================

/**
 * TODO: Replace with uSwitch/MoneySuperMarket API
 * @param postcode - User's postcode
 * @param currentBill - Current monthly energy bill
 * @param greenOnly - Filter for renewable tariffs only
 * @returns Energy tariff comparison results
 */
export async function codeWordAPI_compareEnergyTariffs(postcode: string, currentBill: number, greenOnly: boolean) {
  await new Promise(resolve => setTimeout(resolve, 600));

  const tariffs = [
    {
      provider: 'octopus go',
      monthlyPrice: 85,
      annualSavings: Math.round((currentBill - 85) * 12),
      renewable: true,
      tariffType: 'fixed',
      exitFee: 0
    },
    {
      provider: 'good energy',
      monthlyPrice: 90,
      annualSavings: Math.round((currentBill - 90) * 12),
      renewable: true,
      tariffType: 'variable',
      exitFee: 0
    },
    {
      provider: 'bulb',
      monthlyPrice: 87,
      annualSavings: Math.round((currentBill - 87) * 12),
      renewable: true,
      tariffType: 'fixed',
      exitFee: 30
    }
  ];

  return greenOnly ? tariffs.filter(t => t.renewable) : tariffs;
}

// =====================================================
// CARBON & ENVIRONMENTAL DATA
// =====================================================

/**
 * TODO: Replace with Carbon Interface API or similar
 * @param activity - Type of activity (flight, car journey, etc.)
 * @param params - Activity-specific parameters
 * @returns Carbon footprint in kg CO2e
 */
export async function codeWordAPI_calculateCarbon(activity: string, params: any) {
  await new Promise(resolve => setTimeout(resolve, 200));

  const calculations = {
    flight: (distance: number) => distance * 0.25, // kg CO2e per km
    car_petrol: (distance: number) => distance * 0.19,
    car_diesel: (distance: number) => distance * 0.21,
    train: (distance: number) => distance * 0.04,
    bus: (distance: number) => distance * 0.1,
    electricity: (kwh: number) => kwh * 0.23, // UK grid average
    gas: (kwh: number) => kwh * 0.18
  };

  const calculator = calculations[activity];
  return calculator ? calculator(params.distance || params.kwh || 0) : 0;
}

/**
 * TODO: Replace with environmental impact database API
 * @param category - Product/activity category
 * @returns Environmental impact factors
 */
export async function codeWordAPI_getEnvironmentalData(category: string) {
  await new Promise(resolve => setTimeout(resolve, 150));

  const data = {
    'beef': { co2PerKg: 27, waterPerKg: 15400 },
    'chicken': { co2PerKg: 6.9, waterPerKg: 4325 },
    'vegetables': { co2PerKg: 2.0, waterPerKg: 322 },
    'clothing_new': { co2PerItem: 15, waterPerItem: 2700 },
    'clothing_secondhand': { co2PerItem: 0.5, waterPerItem: 0 }
  };

  return data[category] || { co2PerKg: 0, waterPerKg: 0 };
}

// =====================================================
// USER AUTHENTICATION & DATA
// =====================================================

/**
 * TODO: Replace with Supabase Auth or Auth0
 * @param email - User email
 * @param password - User password
 * @returns Authentication token and user data
 */
export async function codeWordAPI_login(email: string, password: string) {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'user-123',
      email: email,
      name: 'Test User',
      createdAt: new Date().toISOString()
    }
  };
}

/**
 * TODO: Replace with Supabase Auth registration
 * @param email - User email
 * @param password - User password
 * @param name - User name
 * @returns New user account data
 */
export async function codeWordAPI_signup(email: string, password: string, name: string) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'user-' + Date.now(),
      email: email,
      name: name,
      createdAt: new Date().toISOString()
    }
  };
}

// =====================================================
// DATA PERSISTENCE
// =====================================================

/**
 * TODO: Replace with Supabase database insert
 * @param userId - User ID
 * @param data - User profile data
 * @returns Saved profile confirmation
 */
export async function codeWordAPI_saveUserProfile(userId: string, data: any) {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock save to localStorage for now
  if (typeof window !== 'undefined') {
    localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
  }

  return {
    success: true,
    profileId: 'profile-' + Date.now(),
    savedAt: new Date().toISOString()
  };
}

/**
 * TODO: Replace with Supabase database query
 * @param userId - User ID
 * @returns User profile data
 */
export async function codeWordAPI_getUserProfile(userId: string) {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Mock retrieve from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`profile_${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  }

  return null;
}

/**
 * TODO: Replace with Supabase database insert
 * @param userId - User ID
 * @param result - Liked result data
 * @returns Save confirmation
 */
export async function codeWordAPI_saveLikedResult(userId: string, result: any) {
  await new Promise(resolve => setTimeout(resolve, 150));

  // Mock save to localStorage
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem(`likes_${userId}`) || '[]');
    existing.push({ ...result, likedAt: new Date().toISOString() });
    localStorage.setItem(`likes_${userId}`, JSON.stringify(existing));
  }

  return { success: true };
}

/**
 * TODO: Replace with Supabase database query
 * @param userId - User ID
 * @returns Array of liked results
 */
export async function codeWordAPI_getLikedResults(userId: string) {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Mock retrieve from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`likes_${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  }

  return [];
}

/**
 * TODO: Replace with Supabase database delete
 * @param userId - User ID
 * @param resultId - Result ID to unlike
 * @returns Delete confirmation
 */
export async function codeWordAPI_removeLikedResult(userId: string, resultId: string) {
  await new Promise(resolve => setTimeout(resolve, 150));

  // Mock remove from localStorage
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem(`likes_${userId}`) || '[]');
    const filtered = existing.filter((r: any) => r.id !== resultId);
    localStorage.setItem(`likes_${userId}`, JSON.stringify(filtered));
  }

  return { success: true };
}

// =====================================================
// SMS & NOTIFICATIONS
// =====================================================

/**
 * TODO: Replace with Twilio SMS API
 * @param phoneNumber - Recipient phone number
 * @param message - SMS message content
 * @returns Send confirmation
 */
export async function codeWordAPI_sendSMS(phoneNumber: string, message: string) {
  await new Promise(resolve => setTimeout(resolve, 400));

  console.log(`[MOCK SMS] To: ${phoneNumber}, Message: ${message}`);

  return {
    success: true,
    messageId: 'sms-' + Date.now(),
    status: 'sent'
  };
}

/**
 * TODO: Replace with email service API (SendGrid, Resend)
 * @param email - Recipient email
 * @param subject - Email subject
 * @param body - Email content
 * @returns Send confirmation
 */
export async function codeWordAPI_sendEmail(email: string, subject: string, body: string) {
  await new Promise(resolve => setTimeout(resolve, 300));

  console.log(`[MOCK EMAIL] To: ${email}, Subject: ${subject}`);

  return {
    success: true,
    emailId: 'email-' + Date.now(),
    status: 'sent'
  };
}

// =====================================================
// PRODUCT & SHOPPING DATA
// =====================================================

/**
 * TODO: Replace with product database API or web scraping
 * @param category - Product category (clothing, electronics, etc.)
 * @param query - Search query
 * @returns Product listings with sustainability scores
 */
export async function codeWordAPI_searchProducts(category: string, query: string) {
  await new Promise(resolve => setTimeout(resolve, 400));

  return [
    {
      name: 'Organic Cotton T-Shirt',
      price: 25,
      provider: 'patagonia',
      sustainabilityScore: 95,
      carbonFootprint: 2.5,
      url: 'https://www.patagonia.com/'
    },
    {
      name: 'Second-hand T-Shirt',
      price: 8,
      provider: 'vinted',
      sustainabilityScore: 100,
      carbonFootprint: 0.1,
      url: 'https://www.vinted.co.uk/'
    },
    {
      name: 'Budget T-Shirt',
      price: 4,
      provider: 'primark',
      sustainabilityScore: 20,
      carbonFootprint: 15,
      url: 'https://www.primark.com/'
    }
  ];
}

// =====================================================
// ANALYTICS & TRACKING
// =====================================================

/**
 * TODO: Replace with analytics service (Google Analytics, Mixpanel, Plausible)
 * @param event - Event name
 * @param properties - Event properties
 */
export async function codeWordAPI_trackEvent(event: string, properties: any) {
  // Mock analytics tracking
  console.log(`[ANALYTICS] ${event}`, properties);
  
  return { success: true };
}