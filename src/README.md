# Zero Zero

> **Save money. Cut carbon. Live smarter.**

Minimalist web app for calculating carbon footprints and finding money-saving alternatives across 9 journey types.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/yourusername/zero-zero)

---

## ✨ Features

- 💰 **Real Savings** - Calculate actual money saved with greener choices
- 🌍 **Carbon Footprint** - UK DEFRA 2024 emission factors
- 🤖 **AI Chat** - Get personalized eco tips (Hugging Face)
- 📱 **Mobile First** - Responsive design, works offline
- 🎨 **Minimalist** - Black & white, no clutter
- 🔒 **Privacy First** - localStorage only, no tracking

---

## 🚀 Quick Start

```bash
# Install
npm install

# Run locally
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build
```

**Works 100% offline - no configuration needed!**

---

## 🌐 Live Demo

**[zerozero.app](https://zerozero.app)** ← Try it now

---

## 📊 Journey Types

| Journey | What it does | Example Output |
|---------|-------------|----------------|
| **Travel** | Compare transport carbon & cost | Train: 5kg CO₂, £49 vs Flight: 120kg CO₂, £60 |
| **Switch** | Find cheaper green energy tariffs | Save £240/year switching to Octopus |
| **Food** | Calculate diet carbon footprint | Veggie day saves 300kg CO₂/year |
| **Home** | Home energy efficiency savings | LED bulbs save £60/year |
| **Shop** | New vs second-hand comparison | Vinted: 80% less carbon, 70% cheaper |
| **Waste** | Composting & recycling impact | Compost saves 50kg CO₂/year |
| **Holiday** | Sustainable travel options | Train adventure: 8kg vs Flight: 450kg |
| **Money** | Financial carbon footprint | Green tariff saves £240 + 700kg CO₂ |
| **Health** | Active transport benefits | Walk instead: Free + 120kg CO₂ saved |

---

## 🔧 Optional: Enable APIs

The app works offline by default. To enable AI chat and live data:

1. **Get free Hugging Face API key**
   - Visit: https://huggingface.co/settings/tokens
   - Free tier: 30,000 characters/month

2. **Add to `.env` file** (already created)
   ```bash
   VITE_HF_API_KEY=hf_xxxxxxxxxxxxx
   ```

3. **Restart:** `npm run dev`

For full API features (weather, air quality, etc.), see [DOCUMENTATION.md](./DOCUMENTATION.md).

---

## 📦 Deploy

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Cloudflare Worker API (Optional)

```bash
cd worker
npm install -g wrangler
wrangler login
wrangler deploy
```

See [DOCUMENTATION.md](./DOCUMENTATION.md) for complete deployment guide.

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS V4
- Vite
- Shadcn/ui

**Backend:**
- Cloudflare Workers
- Hugging Face AI
- Open-Meteo (weather)
- OpenAQ (air quality)
- OpenStreetMap (places)

**Data:**
- UK DEFRA 2024 emission factors
- Energy Saving Trust averages
- localStorage for persistence

---

## 📖 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete guide
  - Setup & Configuration
  - Deployment Guide
  - API Reference
  - Logic System
  - Worker Backend
  - Production Checklist

---

## 🎨 Design System

**Typography:**
- Font: Roboto (300, 400, 900)
- Sizes: 100px (h1), 58px (h2), 32px (h3), 20px (body)
- All lowercase except CTAs

**Colors:**
- Strict black (#000) and white (#fff)
- No grays, no colors, no shadows

**Layout:**
- Max width: 480px
- Padding: 16px
- Mobile-first responsive

**Philosophy:**
"Google meets Apple meets Attenborough"

---

## 💰 Cost

**Free Tier:**
- Vercel: 100GB bandwidth/month
- Cloudflare Workers: 100k requests/day
- Hugging Face: 30k chars/month
- All data APIs: Unlimited

**Total: $0/month for ~10k users**

---

## 🤝 Contributing

We welcome contributions! See [DOCUMENTATION.md](./DOCUMENTATION.md) for:
- Development workflow
- Code style guide
- Design guidelines
- How to add new journeys

---

## 📄 License

MIT License - See [LICENSE](./LICENSE)

---

## 🙏 Attribution

**Data Sources:**
- UK DEFRA (emission factors)
- Energy Saving Trust (UK averages)
- Carbon Independent (footprint data)

**APIs:**
- Open-Meteo (weather)
- OpenAQ (air quality)
- OpenStreetMap (places)
- Hugging Face (AI)

---

## 📞 Support

- **Documentation:** [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/zero-zero/issues)
- **Email:** support@zerozero.app

---

**Built with ❤️ for the planet**

**Version:** 1.0.0 | **Status:** Production Ready ✅
