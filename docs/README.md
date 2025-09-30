# Zero Zero

> Save money. Cut carbon. Live smarter.

Zero Zero is a minimalist web application that helps users make better decisions for their wallet and the planet. Compare travel options, switch energy suppliers, reduce food waste, and get personalized tips to lower your carbon footprint.

## 🎯 Features

- **7 Journey Types**: Travel, Energy Switching, Food, Home, Shopping, Waste, Holiday
- **Zai AI Chat**: Interactive assistant that suggests money-saving and carbon-reducing actions
- **Carbon Footprint Calculator**: Complete profile assessment with personalized tips
- **Results Comparison**: See cheapest, greenest, and best balance options side-by-side
- **Saved Likes**: Bookmark your favorite results for later
- **Location-aware**: Personalized recommendations based on your region

## 🎨 Design Philosophy

Zero Zero follows a strict "Google meets Apple meets Attenborough" aesthetic:

- **Black & white only** (`#000` / `#fff`)
- **Lowercase everything** - approachable and friendly
- **No shadows or strokes** (except input underlines)
- **Typography**: Roboto (300, 400, 900) with consistent hierarchy
- **Typewriter animations** - 65ms per character
- **Mobile-first** - 480px max-width responsive wrapper

## 🏗️ Architecture

```
/
├── components/          # React components
│   ├── IntroPage.tsx       # Welcome sequence with brand animation
│   ├── Homepage.tsx        # Main journey selector
│   ├── ChatPage.tsx        # Zai AI assistant
│   ├── JourneyPage.tsx     # Dynamic question flow
│   ├── ResultsPage.tsx     # Comparison cards
│   ├── LikesPage.tsx       # Saved results
│   └── ui/                 # Shadcn/UI components
├── utils/               # Business logic
│   ├── codeWordAPI.ts      # 🔑 Centralized mock API layer
│   ├── computeFootprint.ts # Carbon calculation engine
│   ├── buildTips.ts        # Personalized recommendations
│   └── locationUtils.ts    # Geolocation utilities
├── styles/
│   └── globals.css         # Tailwind v4 + custom design system
└── App.tsx              # Main routing & state management
```

## 🔌 API Integration (via codeWordAPI)

**Current State**: All external APIs are mocked through `codeWordAPI.ts`

The app is designed to work standalone without any API keys or backend services. When you're ready to integrate real APIs, simply replace the mock functions in `/utils/codeWordAPI.ts` with real API calls.

### Planned API Integrations

| Category | Mock Function | Real API Replacement |
|----------|---------------|---------------------|
| **Chat AI** | `codeWordAPI_chatResponse()` | OpenAI GPT-4 API |
| **Geocoding** | `codeWordAPI_geocodeLocation()` | Google Maps Geocoding |
| **Travel Search** | `codeWordAPI_searchFlights()` | Skyscanner/Kiwi.com |
| **Train Booking** | `codeWordAPI_searchTrains()` | Trainline/Rail Europe |
| **Energy Comparison** | `codeWordAPI_compareEnergyTariffs()` | uSwitch/MoneySuperMarket |
| **Carbon Data** | `codeWordAPI_calculateCarbon()` | Carbon Interface API |
| **Authentication** | `codeWordAPI_login()` | Supabase Auth |
| **Database** | `codeWordAPI_saveUserProfile()` | Supabase Database |
| **SMS Notifications** | `codeWordAPI_sendSMS()` | Twilio |
| **Email** | `codeWordAPI_sendEmail()` | SendGrid/Resend |
| **Analytics** | `codeWordAPI_trackEvent()` | Plausible/Mixpanel |

Each function includes detailed documentation on how to replace it with real API calls.

📖 **Ready to Integrate?**: See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for step-by-step instructions on replacing mocks with real APIs.

## 🚀 Quick Start

### Deploy Now (2 minutes) ⚡

```bash
npm install       # Install dependencies
npm run build     # Build for production
vercel           # Deploy to Vercel
```

See [DEPLOY_NOW.md](./DEPLOY_NOW.md) for detailed deployment instructions.

### Local Development

```bash
git clone https://github.com/yourusername/zero-zero.git
cd zero-zero
npm install
npm run dev
```

**That's it!** No API keys, no `.env` file, no configuration needed.

The app runs on `http://localhost:3000`

📖 **New here?** Read the [Quick Start Guide](./QUICKSTART.md) for a detailed walkthrough.

### Prerequisites

- Node.js 18+ (uses ES modules)
- No API keys required for development
- No `.env` file needed
- No external services required

### Development

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

## 📦 Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/zero-zero)

Or manually:

```bash
npm run build        # Creates dist/ folder
# Upload to any static host
```

**Supported Platforms**: Vercel, Netlify, Cloudflare Pages, GitHub Pages

📖 **Detailed Instructions**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific guides.

📋 **Going Live?**: Check [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) before deploying.

## 🗂️ Project Structure Details

### State Management

All state is managed in `/App.tsx` using React hooks:
- `currentPage` - Navigation state
- `selectedJourney` - Active journey type
- `journeyAnswers` - User responses
- `likedResults` - Bookmarked results
- `userLocation` - Geolocation data

### Journey Flow

1. **Intro** → Typewriter animation + brand reveal
2. **Location Prompt** → Request geolocation permission
3. **Homepage** → Choose journey or chat with Zai
4. **Journey Questions** → 6-8 progressive questions
5. **Results** → Comparison cards with actions
6. **Likes** → View saved results

### Data Persistence

Currently uses `localStorage` for:
- User profiles (`profile_${userId}`)
- Liked results (`likes_${userId}`)

**TODO**: Replace with `codeWordAPI_saveUserProfile()` for server-side persistence

## 🧪 Mock Data

All mock data is centralized in `/utils/codeWordAPI.ts`:

- **Travel Results**: FlixBus, Eurostar, Ryanair comparisons
- **Energy Tariffs**: Octopus, Good Energy, Bulb options
- **Food Tips**: Too Good To Go, Olio, meal planning
- **Home Improvements**: LED bulbs, insulation, smart thermostats
- **Shopping**: Second-hand vs new comparisons

Update these mock objects to customize results for demos.

## 🎯 Future Enhancements

### Phase 1: Backend Integration
- [ ] Replace `codeWordAPI` mocks with real APIs
- [ ] Implement Supabase authentication
- [ ] Add database persistence
- [ ] Set up analytics tracking

### Phase 2: Advanced Features
- [ ] User accounts and profiles
- [ ] Social sharing of results
- [ ] Referral program
- [ ] Carbon offset marketplace
- [ ] Community challenges

### Phase 3: Expansion
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Regional customization (EU, US, AUS)
- [ ] B2B enterprise version

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements.

**Quick Start for Contributors**:
1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Submit a Pull Request

📖 **Full Guidelines**: Read [CONTRIBUTING.md](./CONTRIBUTING.md) for code style, testing, and best practices.

## 📝 Code Guidelines

- **Lowercase**: All user-facing text must be lowercase
- **No custom fonts**: Roboto only (300, 400, 900)
- **Colors**: `#000` and `#fff` only - no grays or colors
- **No shadows**: Use borders/underlines only
- **Typography**: Use CSS variables (--h1, --h2, --h3, --h4, --body)
- **Animations**: 65ms typewriter timing, no complex transitions
- **Comments**: Document all `codeWordAPI` replacement points

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Design inspiration: Google, Apple, David Attenborough documentaries
- Journey flow: uSwitch, ChatGPT
- Icons: Lucide React
- UI Components: Shadcn/UI
- Carbon data: DEFRA, Carbon Interface
- Environmental research: Energy Saving Trust

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get running in 5 minutes
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Vercel, Netlify, etc.
- **[API Integration Guide](./API_INTEGRATION_GUIDE.md)** - Replace mocks with real APIs
- **[Contributing Guide](./CONTRIBUTING.md)** - Code style, testing, PR process
- **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Pre-launch verification

## 📧 Contact & Support

- **Questions**: [GitHub Discussions](https://github.com/yourusername/zero-zero/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/zero-zero/issues)
- **Instagram**: [@percyzerozero](https://www.instagram.com/percyzerozero/)

## 🗺️ Roadmap

- [x] MVP with 7 journey types
- [x] Zai chat assistant
- [x] Carbon footprint calculator
- [x] Mock API layer for deployment
- [ ] Real API integrations
- [ ] User accounts & authentication
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Community challenges
- [ ] Carbon offset marketplace

## ⭐ Star History

If Zero Zero helps you or your users, please give it a star! It helps others discover the project.

---

Built with ❤️ for a better planet

**License**: MIT | **Version**: 1.0.0 | **Status**: Production Ready 🚀