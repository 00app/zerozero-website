# Zero Zero - Complete Documentation

> **Save money. Cut carbon. Live smarter.**

Complete guide for the Zero Zero MVP - a minimalist web app for calculating carbon footprints and finding money-saving alternatives.

**Version:** 1.0.0 Production Ready  
**Last Updated:** January 2025

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Setup & Configuration](#setup--configuration)
3. [Deployment Guide](#deployment-guide)
4. [API Reference](#api-reference)
5. [Logic System](#logic-system)
6. [Worker Backend](#worker-backend)
7. [Production Checklist](#production-checklist)
8. [Contributing](#contributing)
9. [Attribution](#attribution)

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run (5 minutes)

```bash
# Clone and install
git clone https://github.com/yourusername/zero-zero.git
cd zero-zero
npm install

# Run locally
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build
```

**The app works 100% offline - no API keys required!**

### Optional: Enable AI Chat

```bash
# Get free key at: https://huggingface.co/settings/tokens
# Add to .env file (already created)
VITE_HF_API_KEY=hf_xxxxxxxxxxxxx

# Restart dev server
npm run dev
```

---

## Setup & Configuration

### Environment Variables

The `.env` file is already created with placeholders. All variables are optional:

```bash
# ============================================================================
# OPTIONAL - API FEATURES
# ============================================================================

# Cloudflare Worker API Base URL (for enhanced calculations)
# Deploy worker first, then add URL here
VITE_API_BASE_URL=https://zerozero-api.yourname.workers.dev

# Hugging Face API Key (for AI chat)
# Free tier: 30,000 characters/month
# Get at: https://huggingface.co/settings/tokens
VITE_HF_API_KEY=hf_xxxxxxxxxxxxx

# Hugging Face Model URL (optional - has default)
VITE_HF_API_URL=https://api-inference.huggingface.co/models/distilgpt2

# ============================================================================
# OPTIONAL - DATABASE (for cloud sync - uses localStorage by default)
# ============================================================================

# Neon Database Connection String
# Get from: https://neon.tech
VITE_NEON_DATABASE_URL=postgresql://user:password@host/database

# Supabase (Alternative to Neon)
# Get from: https://supabase.com
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```

### How It Works

**Offline Mode (Default):**
- All 9 journeys calculate locally using UK DEFRA 2024 emission factors
- Smart fallback responses for chat
- localStorage for saving favorites
- No external dependencies

**Online Mode (With APIs):**
- Live weather data (Open-Meteo)
- Real-time air quality (OpenAQ)
- Nearby eco places (OpenStreetMap)
- AI-powered chat (Hugging Face)
- Enhanced calculations via Worker API

### Project Structure

```
zero-zero/
├── App.tsx                    # Main app entry point
├── .env                       # Environment config
├── components/
│   ├── IntroPage.tsx         # Landing page
│   ├── Homepage.tsx          # Journey selection
│   ├── JourneyPage.tsx       # Question flow
│   ├── ResultsPage.tsx       # Comparison cards
│   ├── ChatPage.tsx          # AI chat interface
│   ├── LikesPage.tsx         # Saved results
│   └── ui/                   # Shadcn components
├── logic/
│   ├── calculateTravel.ts    # Travel journey logic
│   ├── calculateSwitch.ts    # Energy switching logic
│   ├── calculateFood.ts      # Food carbon footprint
│   └── ... (9 journey types)
├── services/
│   ├── api.ts               # Unified API layer
│   ├── ai.ts                # AI chat service
│   └── maps.ts              # Location services
├── data/
│   ├── carbonFactors.ts     # UK DEFRA emission factors
│   └── tips.json            # Sustainability tips
├── worker/
│   ├── index.js            # Cloudflare Worker backend
│   └── wrangler.toml       # Worker config
└── styles/
    └── globals.css         # Tailwind V4 + custom styles
```

---

## Deployment Guide

### Deploy to Vercel (Frontend)

#### Option 1: Automated Deploy

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option 2: GitHub Integration

1. Push to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repo
5. Click "Deploy"

#### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
VITE_API_BASE_URL=https://zerozero-api.yourname.workers.dev
VITE_HF_API_KEY=hf_xxxxxxxxxxxxx
```

### Deploy Worker API (Backend)

The Worker provides live data and enhanced calculations.

#### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
wrangler login
```

#### Step 2: Deploy Worker

```bash
cd worker
wrangler deploy
```

This will output your Worker URL:
```
✨ https://zerozero-api.YOUR_NAME.workers.dev
```

#### Step 3: Add Secrets

```bash
# Add Hugging Face API key
wrangler secret put HF_API_KEY
# Paste your hf_xxx key when prompted
```

#### Step 4: Update Frontend

Add the Worker URL to your `.env`:
```bash
VITE_API_BASE_URL=https://zerozero-api.YOUR_NAME.workers.dev
```

Redeploy frontend:
```bash
vercel --prod
```

### Custom Domain (Optional)

**Vercel:**
1. Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records

**Cloudflare Worker:**
1. Edit `worker/wrangler.toml`
2. Add routes section:
```toml
[[routes]]
pattern = "api.yourdomain.com/*"
zone_name = "yourdomain.com"
```
3. Redeploy: `wrangler deploy`

### Deployment Checklist

**Before Deploy:**
- [ ] Run `npm run build` successfully
- [ ] Test all 9 journeys locally
- [ ] Verify .env variables
- [ ] Review API endpoints

**Deploy Worker:**
- [ ] `wrangler login`
- [ ] `wrangler secret put HF_API_KEY`
- [ ] `wrangler deploy`
- [ ] Copy Worker URL

**Deploy Frontend:**
- [ ] Add Worker URL to Vercel env vars
- [ ] `vercel --prod`
- [ ] Test live site

**Post-Deploy:**
- [ ] Test all journeys end-to-end
- [ ] Verify chat works
- [ ] Check API responses
- [ ] Monitor error logs for 24h

---

## API Reference

### Worker Endpoints

Base URL: `https://zerozero-api.YOUR_NAME.workers.dev`

#### Health Check
```bash
GET /health
```

Response:
```json
{
  "ok": true,
  "message": "Zero Zero Worker active 🚀",
  "version": "1.0.0"
}
```

#### Weather Data
```bash
GET /weather?lat=51.5074&lon=-0.1278
```

Response:
```json
{
  "weather": {
    "temp": 15,
    "humidity": 65,
    "condition": "partly cloudy",
    "location": "Current Location"
  }
}
```

#### Air Quality
```bash
GET /air?lat=51.5074&lon=-0.1278
```

Response:
```json
{
  "airQuality": {
    "aqi": 42,
    "quality": "good",
    "pollutants": {
      "pm25": 8,
      "pm10": 15,
      "no2": 12
    }
  }
}
```

#### Places Search
```bash
GET /places?q=recycling&lat=51.5074&lon=-0.1278
```

Response:
```json
{
  "places": [
    {
      "name": "Local Recycling Centre",
      "address": "123 Main St, London",
      "type": "recycling",
      "distance": null,
      "url": "https://www.openstreetmap.org/..."
    }
  ]
}
```

#### Tips Feed
```bash
GET /tips
```

Response:
```json
{
  "tips": [
    {
      "id": "1",
      "category": "home",
      "text": "turn heating down 1°c to save 10%",
      "impact": "saves £60/year",
      "carbonSaving": 0,
      "moneySaving": 60
    }
  ]
}
```

#### Journey Calculations
```bash
GET /journey/{journeyId}/results?param1=value1&param2=value2
```

Example - Travel:
```bash
GET /journey/travel/results?mode=car&distance=100
```

Response:
```json
{
  "result": {
    "journey": "travel",
    "carbonKg": 21,
    "moneySaved": 27,
    "results": [
      {
        "title": "cheapest",
        "provider": "coach",
        "price": "£8",
        "carbon": "3kg co₂",
        "rationale": "lowest cost option",
        "cta": "book",
        "href": "https://www.nationalexpress.com"
      }
    ],
    "tips": []
  }
}
```

#### AI Chat
```bash
POST /chat
Content-Type: application/json

{
  "prompt": "how can i save energy at home?"
}
```

Response:
```json
{
  "response": "walking and cycling are free and zero-carbon...",
  "suggestions": ["travel help", "energy switch", "food tips"]
}
```

### Frontend API Service

The app uses a unified API service layer (`/services/api.ts`):

```typescript
import { 
  getWeather,
  getAir,
  getPlaces,
  getTips,
  getJourneyResults,
  askZai
} from './services/api';

// Weather
const weather = await getWeather(lat, lon);

// Air quality
const air = await getAir(lat, lon);

// Places search
const places = await getPlaces('recycling', lat, lon);

// Tips
const tips = await getTips();

// Journey results
const result = await getJourneyResults('travel', { mode: 'car', distance: 100 });

// AI chat
const response = await askZai('how to save money?');
```

### External APIs Used

**Open-Meteo (Weather)**
- Free, no key required
- Unlimited requests
- Documentation: https://open-meteo.com/

**OpenAQ (Air Quality)**
- Free API
- Rate limited but generous
- Documentation: https://docs.openaq.org/

**OpenStreetMap Nominatim (Places)**
- Free, fair use policy
- Must set User-Agent header
- Documentation: https://nominatim.org/

**Hugging Face (AI Chat)**
- Free tier: 30k chars/month
- Requires API key
- Documentation: https://huggingface.co/docs

---

## Logic System

### Journey Calculation Engine

Zero Zero calculates carbon footprints and money savings for 9 journey types using real UK DEFRA 2024 emission factors.

### Carbon Emission Factors

From `/data/carbonFactors.ts`:

```typescript
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
  
  // Food (kg CO₂ per kg food)
  beef: 27.0,
  lamb: 24.0,
  pork: 12.1,
  chicken: 6.9,
  fish: 6.1,
  vegetables: 0.4,
  
  // Waste (kg CO₂ per kg waste)
  landfill: 0.5,
  recycling: 0.02,
  compost: 0.01,
};
```

### Journey Types

#### 1. Travel
**Questions:** From, To, Date, Mode  
**Calculation:** Distance × emission factor by mode  
**Output:** Carbon kg, money saved vs car

Example:
```typescript
import { calculateTravel } from './logic/calculateTravel';

const result = await calculateTravel({
  from: 'London',
  to: 'Manchester',
  date: '2025-02-01',
  mode: 'train'
});

// Returns:
{
  carbonKg: 15,
  moneySaved: 40,
  distance: 200,
  tips: [...]
}
```

#### 2. Switch (Energy)
**Questions:** Usage level, Current tariff  
**Calculation:** kWh × tariff difference  
**Output:** Carbon kg reduced, £ saved/year

#### 3. Food
**Questions:** Meat meals/week, Veggie meals/week  
**Calculation:** Meals × food emission factors  
**Output:** Carbon kg/week, £ saved switching to veggie

#### 4. Home
**Questions:** Home size, Current energy use  
**Calculation:** kWh × efficiency improvements  
**Output:** Carbon kg reduced, £ saved/year

#### 5. Shop
**Questions:** Item type, Purchase frequency  
**Calculation:** New vs second-hand footprint  
**Output:** Carbon kg saved, £ saved

#### 6. Waste
**Questions:** Waste kg/week, Recycling %  
**Calculation:** Waste × disposal method factors  
**Output:** Carbon kg reduced via composting

#### 7. Holiday
**Questions:** Destination, Transport mode  
**Calculation:** Distance × travel + accommodation  
**Output:** Carbon kg, £ cost

#### 8. Money
**Questions:** Monthly spend categories  
**Calculation:** Spending × carbon intensity  
**Output:** Financial carbon footprint

#### 9. Health
**Questions:** Activity type, Frequency  
**Calculation:** Health benefits + transport avoided  
**Output:** Carbon kg saved, health impact

### Using the Logic System

```typescript
import { runJourney, saveJourneyResult } from './logic';

// Run any journey
const result = await runJourney('travel', {
  from: 'London',
  to: 'Edinburgh',
  date: '2025-03-01',
  mode: 'train'
});

// Save result to localStorage
saveJourneyResult('travel', result);

// Get saved results
import { getJourneyResults } from './logic/storage';
const history = getJourneyResults('travel');
```

### UK Averages

```typescript
export const ukAverages = {
  electricityKwh: 200,      // ~2400 kWh/year
  gasKwh: 833,              // ~10,000 kWh/year
  carMilesWeekly: 150,      // ~7800 miles/year
  foodSpendWeekly: 60,      // ~£3120/year
};
```

### Savings Calculations

```typescript
export const savingsFactors = {
  // Per kWh saved
  electricitySaving: 0.30,  // £/kWh
  gasSaving: 0.07,          // £/kWh
  
  // Per mile
  carCostPerMile: 0.35,
  trainCostPerMile: 0.15,
  
  // Percentages
  dietSwitchSaving: 0.20,        // 20% food cost saving
  energyEfficiencySaving: 0.25,  // 25% with improvements
};
```

---

## Worker Backend

### Architecture

The Cloudflare Worker provides:
- Live data integration (weather, air, places)
- Real carbon calculations
- AI chat responses
- Journey result computation
- No database required (stateless)

### Local Development

```bash
cd worker

# Install dependencies
npm install -g wrangler

# Run locally
wrangler dev

# Test endpoint
curl http://localhost:8787/health
```

### Configuration

Edit `worker/wrangler.toml`:

```toml
name = "zerozero-api"
main = "index.js"
compatibility_date = "2025-01-10"
workers_dev = true
```

### Secrets Management

```bash
# Add secrets
wrangler secret put HF_API_KEY
wrangler secret put HF_API_URL  # optional

# List secrets
wrangler secret list

# Delete secret
wrangler secret delete HF_API_KEY
```

### Monitoring

**Cloudflare Dashboard:**
- Visit dash.cloudflare.com
- Select your Worker
- View metrics:
  - Requests per second
  - Error rate
  - CPU time
  - Success rate

**Logs:**
```bash
# Tail logs in real-time
wrangler tail

# Filter by status
wrangler tail --status error
```

### Worker Code Structure

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Health check
    if (url.pathname === '/health') {
      return json({ ok: true });
    }
    
    // Journey calculations
    if (url.pathname.startsWith('/journey/')) {
      const id = url.pathname.split('/')[2];
      return json(calculateJourney(id, params));
    }
    
    // 404
    return json({ error: 'Not found' }, 404);
  }
};

function calculateJourney(id, params) {
  // Real UK DEFRA calculations
  switch (id) {
    case 'travel':
      return calculateTravel(params);
    case 'switch':
      return calculateSwitch(params);
    // ... 9 journey types
  }
}
```

### Cost Estimates

**Free Tier (Cloudflare Workers):**
- 100,000 requests/day
- 10ms CPU time per request
- No egress fees
- **Handles ~10k users/month FREE**

**Paid Tier ($5/month):**
- 10M requests/month
- 50ms CPU time
- **Handles ~100k users/month**

---

## Production Checklist

### Pre-Launch

**Code Quality:**
- [ ] All TypeScript errors fixed
- [ ] `npm run build` succeeds
- [ ] No console errors in browser
- [ ] All 9 journeys tested end-to-end

**Performance:**
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Total bundle size < 500KB

**Functionality:**
- [ ] All journeys calculate correctly
- [ ] Results page shows 3 options
- [ ] Like/save works
- [ ] Chat responds (AI or fallback)
- [ ] Works offline

**Security:**
- [ ] No API keys in client code
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] No sensitive data logged

### Deploy

**Worker:**
- [ ] `wrangler deploy` succeeds
- [ ] Health check returns 200
- [ ] All endpoints tested
- [ ] Secrets added (HF_API_KEY)

**Frontend:**
- [ ] Environment variables set
- [ ] `vercel --prod` succeeds
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### Post-Launch

**Monitoring:**
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Uptime monitoring enabled
- [ ] Set up status page

**Day 1:**
- [ ] Test all flows live
- [ ] Monitor error logs
- [ ] Check API rate limits
- [ ] Verify analytics working

**Week 1:**
- [ ] Review user feedback
- [ ] Monitor costs
- [ ] Check API quotas
- [ ] Analyze drop-off points

**Month 1:**
- [ ] Review analytics
- [ ] Optimize slow pages
- [ ] Update tips content
- [ ] Plan next features

### Rollback Plan

If issues occur:

```bash
# Rollback Vercel
vercel rollback

# Rollback Worker
wrangler rollback

# Or redeploy previous version
git checkout <previous-commit>
vercel --prod
```

### Performance Targets

- **Load time:** < 2s (3G)
- **First paint:** < 1s
- **Interactive:** < 3s
- **Lighthouse:** > 90
- **Core Web Vitals:** All green

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile: iOS 14+, Android 9+

---

## Contributing

### Development Workflow

1. **Fork & Clone**
```bash
git clone https://github.com/yourusername/zero-zero.git
cd zero-zero
npm install
```

2. **Create Branch**
```bash
git checkout -b feature/your-feature
```

3. **Make Changes**
- Follow existing code style
- Test thoroughly
- Update documentation

4. **Test**
```bash
npm run build
npm run preview
```

5. **Commit**
```bash
git add .
git commit -m "feat: add your feature"
```

6. **Push & PR**
```bash
git push origin feature/your-feature
```

### Code Style

**TypeScript:**
- Use TypeScript for all new files
- Define types for props and state
- Avoid `any` type

**React:**
- Functional components only
- Use hooks (useState, useCallback, etc.)
- Memoize expensive calculations

**CSS:**
- Use Tailwind V4 utilities
- Follow existing class patterns
- No inline styles except dynamic values

**Naming:**
- Components: PascalCase
- Functions: camelCase
- Files: kebab-case.tsx
- Constants: UPPER_SNAKE_CASE

### Design Guidelines

**Typography:**
- H1: 100px (intro only)
- H2: 58px (questions)
- H3: 32px (headings)
- H4/Body: 20px
- Chat meta: 12px
- Font: Roboto (300, 400, 900)

**Colors:**
- Background: `#000` (black)
- Foreground: `#fff` (white)
- No grays, no colors
- Strict black & white only

**Spacing:**
- Max width: 480px
- Padding: 16px
- Gap: 10px (pills)
- Button: 80px circle

**Buttons:**
- Primary: White circle (80px)
- Secondary: Pill (min-height 56px)
- Ghost: Text only, no border

**Animation:**
- Typewriter: 65ms/char
- Transitions: 0.2s ease
- No bounce/spring effects

### Adding New Journey

1. **Create Calculator**
```typescript
// logic/calculateNewJourney.ts
export async function calculateNewJourney(answers: any) {
  // Your calculation logic
  return {
    carbonKg: 100,
    moneySaved: 50,
    tips: []
  };
}
```

2. **Add to Index**
```typescript
// logic/index.ts
import { calculateNewJourney } from './calculateNewJourney';

export async function runJourney(journey: string, answers: any) {
  switch (journey) {
    case 'newjourney':
      return calculateNewJourney(answers);
  }
}
```

3. **Add to Worker**
```javascript
// worker/index.js
function calculateJourney(id, params) {
  switch (id) {
    case 'newjourney':
      return calculateNewJourney(params);
  }
}
```

4. **Test**
```bash
npm run dev
# Navigate to new journey
# Verify calculations
```

---

## Attribution

### Open Source Libraries

- **React** - MIT License
- **Vite** - MIT License
- **Tailwind CSS** - MIT License
- **Shadcn/ui** - MIT License
- **TypeScript** - Apache 2.0

### Data Sources

- **UK DEFRA** - Emission factors (public domain)
- **Energy Saving Trust** - UK consumption averages
- **Carbon Independent** - Carbon footprint data

### APIs

- **Open-Meteo** - Weather data (CC BY 4.0)
- **OpenAQ** - Air quality data (CC BY 4.0)
- **OpenStreetMap** - Map data (ODbL)
- **Hugging Face** - AI models (Apache 2.0)

### Design Philosophy

Inspired by:
- Google's minimalism
- Apple's clarity
- David Attenborough's trustworthy communication

### Contributors

See GitHub contributors page.

### License

MIT License - See LICENSE file.

---

## Support & Resources

### Documentation
- This file (DOCUMENTATION.md)
- README.md (project overview)
- Inline code comments

### Community
- GitHub Issues: Bug reports
- GitHub Discussions: Questions
- Discord: Coming soon

### Professional Support
- Email: support@zerozero.app
- Priority support available for organizations

### Related Links
- Live app: https://zerozero.app
- API status: https://status.zerozero.app
- Blog: https://blog.zerozero.app

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
