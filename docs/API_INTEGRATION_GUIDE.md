# API Integration Guide

This document explains how to replace mock functions in `/utils/codeWordAPI.ts` with real API integrations.

## Overview

All external API calls are centralized in `/utils/codeWordAPI.ts`. Each function:
1. Contains mock data for development
2. Includes TODO comments for real API replacement
3. Has consistent async/await patterns
4. Handles errors gracefully

## Integration Priority

Recommended order for integrating real APIs:

1. **Location Services** (immediate value, low cost)
2. **Analytics** (track usage, free tier available)
3. **Chat AI** (core feature, paid)
4. **Travel APIs** (revenue potential)
5. **Energy Comparison** (partner opportunities)
6. **User Authentication** (scale preparation)

---

## 1. Chat & AI Assistant

### Current Mock
```typescript
export async function codeWordAPI_chatResponse(userMessage: string)
```

### Replace With: OpenAI GPT-4

**API**: OpenAI Chat Completions
**Docs**: https://platform.openai.com/docs/api-reference/chat

**Implementation**:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function codeWordAPI_chatResponse(userMessage: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are Zai, a friendly assistant helping users save money and reduce carbon footprint. 
                   Provide concise, actionable advice about: travel, energy bills, food waste, home heating, 
                   shopping, and recycling. Always suggest 2-3 specific actions with links.
                   Keep responses under 100 words. Use lowercase only.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const aiResponse = response.choices[0].message.content;
    
    // Parse response to extract actions (you may need to fine-tune prompt for structured output)
    return {
      type: 'zai',
      label: 'response',
      copy: aiResponse,
      actions: extractActions(aiResponse) // Helper function to parse action links
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock response
    return {
      type: 'zai',
      label: 'error',
      copy: 'sorry, i had trouble processing that. please try again.',
      actions: []
    };
  }
}
```

**Environment Variable**:
```bash
OPENAI_API_KEY=sk-proj-...
```

**Cost**: ~$0.03 per chat (GPT-4) or ~$0.002 (GPT-3.5-turbo)

---

## 2. Location & Geocoding

### Current Mock
```typescript
export async function codeWordAPI_geocodeLocation(address: string)
export async function codeWordAPI_getUserLocation()
export async function codeWordAPI_getCountryFromIP()
```

### Replace With: Google Maps + IPinfo

**API 1**: Google Maps Geocoding API
**Docs**: https://developers.google.com/maps/documentation/geocoding

**Implementation**:
```typescript
export async function codeWordAPI_geocodeLocation(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formatted: result.formatted_address
      };
    }
    
    throw new Error('Geocoding failed');
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback to mock
    return { lat: 51.5074, lng: -0.1278, formatted: address };
  }
}
```

**API 2**: IPinfo for IP Geolocation
**Docs**: https://ipinfo.io/developers

```typescript
export async function codeWordAPI_getCountryFromIP() {
  const apiKey = process.env.IPINFO_TOKEN;
  const url = `https://ipinfo.io/json?token=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      country_code: data.country,
      country_name: data.country,
      region: data.region,
      city: data.city,
      currency: data.country === 'GB' ? 'GBP' : 'EUR'
    };
  } catch (error) {
    console.error('IP geolocation error:', error);
    return { country_code: 'UK', country_name: 'United Kingdom', region: 'England', city: 'London', currency: 'GBP' };
  }
}
```

**Environment Variables**:
```bash
GOOGLE_MAPS_API_KEY=AIza...
IPINFO_TOKEN=abc123...
```

**Cost**: 
- Google Maps: $5/1000 requests (free $200/month credit)
- IPinfo: 50k requests/month free

---

## 3. Travel & Booking

### Current Mocks
```typescript
export async function codeWordAPI_searchFlights(...)
export async function codeWordAPI_searchTrains(...)
export async function codeWordAPI_searchCoaches(...)
```

### Replace With: Kiwi.com + Trainline APIs

**API 1**: Kiwi.com (Flights + Buses)
**Docs**: https://docs.kiwi.com/

```typescript
export async function codeWordAPI_searchFlights(from: string, to: string, date: string, passengers: number) {
  const apiKey = process.env.KIWI_API_KEY;
  const url = `https://api.tequila.kiwi.com/v2/search`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
      },
      params: {
        fly_from: from,
        fly_to: to,
        date_from: date,
        date_to: date,
        adults: passengers,
        curr: 'GBP',
        limit: 5
      }
    });
    
    const data = await response.json();
    
    return data.data.map(flight => ({
      airline: flight.airlines[0],
      price: flight.price,
      carbon: calculateFlightCarbon(flight.distance), // Custom calculation
      duration: formatDuration(flight.duration),
      departure: flight.local_departure,
      arrival: flight.local_arrival
    }));
  } catch (error) {
    console.error('Flight search error:', error);
    // Return mock data as fallback
    return [...]; // Mock flights
  }
}
```

**API 2**: Trainline Partner API
**Docs**: Contact Trainline for partner access

**Alternative**: RailEasy API (https://raileasy.trainhq.com/)

```typescript
export async function codeWordAPI_searchTrains(from: string, to: string, date: string, passengers: number) {
  // Implementation depends on which rail API you partner with
  // Most require affiliate/partner agreements
  
  // Example with generic endpoint:
  const url = `https://api.trainline.com/search`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TRAINLINE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        origin: from,
        destination: to,
        outbound_date: date,
        passengers: passengers
      })
    });
    
    const data = await response.json();
    // Parse and return results
    
  } catch (error) {
    console.error('Train search error:', error);
    return [...]; // Mock trains
  }
}
```

**Environment Variables**:
```bash
KIWI_API_KEY=...
TRAINLINE_API_KEY=...
```

**Cost**: 
- Kiwi.com: Free tier available, revenue share model
- Trainline: Partner program, commission-based

---

## 4. Energy & Utilities

### Current Mock
```typescript
export async function codeWordAPI_compareEnergyTariffs(...)
```

### Replace With: Energy Price Comparison APIs

**Option 1**: Utility API (utilities-api.com)
**Docs**: https://www.utilities-api.com/docs

**Option 2**: Partner with uSwitch/MoneySuperMarket
**Requires**: Affiliate/partner agreement

```typescript
export async function codeWordAPI_compareEnergyTariffs(postcode: string, currentBill: number, greenOnly: boolean) {
  const apiKey = process.env.UTILITIES_API_KEY;
  const url = `https://api.utilities-api.com/energy/compare`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postcode: postcode,
        current_spend: currentBill * 12,
        fuel_type: 'dual',
        green_only: greenOnly
      })
    });
    
    const data = await response.json();
    
    return data.tariffs.map(tariff => ({
      provider: tariff.supplier,
      monthlyPrice: Math.round(tariff.annual_cost / 12),
      annualSavings: currentBill * 12 - tariff.annual_cost,
      renewable: tariff.renewable_percentage === 100,
      tariffType: tariff.contract_type,
      exitFee: tariff.exit_fees
    }));
  } catch (error) {
    console.error('Energy comparison error:', error);
    return [...]; // Mock tariffs
  }
}
```

**Environment Variables**:
```bash
UTILITIES_API_KEY=...
```

**Cost**: Varies, typically £0.50-£2 per comparison

---

## 5. Carbon & Environmental Data

### Current Mock
```typescript
export async function codeWordAPI_calculateCarbon(...)
export async function codeWordAPI_getEnvironmentalData(...)
```

### Replace With: Carbon Interface API

**API**: Carbon Interface
**Docs**: https://docs.carboninterface.com/

```typescript
export async function codeWordAPI_calculateCarbon(activity: string, params: any) {
  const apiKey = process.env.CARBON_INTERFACE_KEY;
  const url = 'https://www.carboninterface.com/api/v1/estimates';
  
  try {
    let requestBody;
    
    switch (activity) {
      case 'flight':
        requestBody = {
          type: 'flight',
          passengers: 1,
          legs: [{
            departure_airport: params.from,
            destination_airport: params.to
          }]
        };
        break;
      
      case 'car_petrol':
      case 'car_diesel':
        requestBody = {
          type: 'vehicle',
          distance_unit: 'km',
          distance_value: params.distance,
          vehicle_model_id: params.vehicleId // From their database
        };
        break;
      
      // Add other activity types
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    return data.data.attributes.carbon_kg;
    
  } catch (error) {
    console.error('Carbon calculation error:', error);
    // Fallback to local calculations
    return params.distance * 0.19; // Mock factor
  }
}
```

**Environment Variables**:
```bash
CARBON_INTERFACE_KEY=...
```

**Cost**: Free tier: 200 requests/month, then $0.04/request

---

## 6. User Authentication & Database

### Current Mocks
```typescript
export async function codeWordAPI_login(...)
export async function codeWordAPI_signup(...)
export async function codeWordAPI_saveUserProfile(...)
export async function codeWordAPI_getUserProfile(...)
```

### Replace With: Supabase

**Service**: Supabase (Firebase alternative)
**Docs**: https://supabase.com/docs

**Setup**:
1. Create Supabase project
2. Create tables (users, profiles, liked_results)
3. Set up Row Level Security (RLS)

**Implementation**:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function codeWordAPI_login(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return {
      success: true,
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        createdAt: data.user.created_at
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

export async function codeWordAPI_saveUserProfile(userId: string, profileData: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return {
      success: true,
      profileId: data.id,
      savedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Save profile error:', error);
    // Fallback to localStorage
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
    return { success: true, fallback: true };
  }
}
```

**Environment Variables**:
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
```

**Cost**: Free tier: 500MB database, 2GB bandwidth

---

## 7. SMS & Email Notifications

### Current Mocks
```typescript
export async function codeWordAPI_sendSMS(...)
export async function codeWordAPI_sendEmail(...)
```

### Replace With: Twilio + Resend

**API 1**: Twilio (SMS)
**Docs**: https://www.twilio.com/docs/sms

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function codeWordAPI_sendSMS(phoneNumber: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    return {
      success: true,
      messageId: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false, error: error.message };
  }
}
```

**API 2**: Resend (Email)
**Docs**: https://resend.com/docs

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function codeWordAPI_sendEmail(email: string, subject: string, body: string) {
  try {
    const result = await resend.emails.send({
      from: 'zai@zerozero.app',
      to: email,
      subject: subject,
      html: body
    });
    
    return {
      success: true,
      emailId: result.id,
      status: 'sent'
    };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}
```

**Environment Variables**:
```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+44...
RESEND_API_KEY=re_...
```

**Cost**:
- Twilio: $0.04/SMS (UK)
- Resend: 100 emails/day free, then $0.001/email

---

## 8. Analytics

### Current Mock
```typescript
export async function codeWordAPI_trackEvent(...)
```

### Replace With: Plausible or Mixpanel

**Option 1**: Plausible (Privacy-first)
**Docs**: https://plausible.io/docs

```typescript
export async function codeWordAPI_trackEvent(event: string, properties: any) {
  const url = 'https://plausible.io/api/event';
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: event,
        url: window.location.href,
        domain: process.env.SITE_DOMAIN,
        props: properties
      })
    });
    
    return { success: true };
  } catch (error) {
    console.error('Analytics error:', error);
    return { success: false };
  }
}
```

**Option 2**: Mixpanel (Advanced analytics)
**Docs**: https://developer.mixpanel.com/

```typescript
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.MIXPANEL_TOKEN);

export async function codeWordAPI_trackEvent(event: string, properties: any) {
  try {
    mixpanel.track(event, properties);
    return { success: true };
  } catch (error) {
    console.error('Analytics error:', error);
    return { success: false };
  }
}
```

**Environment Variables**:
```bash
SITE_DOMAIN=zerozero.app
MIXPANEL_TOKEN=...
```

**Cost**:
- Plausible: $9/month for 10k pageviews
- Mixpanel: Free tier: 100k events/month

---

## Testing Strategy

1. **Local Development**: Use mocks (current state)
2. **Staging**: Enable 1-2 APIs at a time
3. **Production**: Full API integration with fallbacks

**Example Pattern**:
```typescript
export async function codeWordAPI_searchFlights(...) {
  // Check if API key is configured
  if (!process.env.KIWI_API_KEY) {
    console.warn('KIWI_API_KEY not set, using mock data');
    return mockFlightData;
  }
  
  try {
    // Real API call
    return await realAPICall();
  } catch (error) {
    console.error('API error, falling back to mock:', error);
    return mockFlightData;
  }
}
```

## Security Best Practices

1. **Never commit API keys** - use `.env` files
2. **Use server-side endpoints** for sensitive keys
3. **Implement rate limiting** to prevent abuse
4. **Rotate keys regularly**
5. **Use environment-specific keys** (dev/staging/prod)

## Cost Management

**Budget-conscious rollout**:

| Phase | Monthly Cost | APIs Enabled |
|-------|-------------|--------------|
| MVP | $0 | All mocks |
| Beta | $20-50 | Location + Analytics |
| Launch | $100-200 | + Chat AI + Travel |
| Scale | $500+ | All APIs + Premium features |

Monitor usage via dashboards:
- OpenAI: https://platform.openai.com/usage
- Google Cloud: https://console.cloud.google.com/billing
- Supabase: https://app.supabase.com/project/_/settings/billing

## Support

For API-specific issues, consult:
- OpenAI Community: https://community.openai.com/
- Supabase Discord: https://discord.supabase.com/
- Google Maps Support: https://developers.google.com/maps/support

For integration help with Zero Zero, open a GitHub issue.