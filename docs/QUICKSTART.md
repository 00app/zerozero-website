# Quick Start Guide

Get Zero Zero running in under 5 minutes!

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- A code editor (VS Code recommended)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zero-zero.git

# Navigate into the project
cd zero-zero

# Install dependencies (takes ~30 seconds)
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:3000**

## What You'll See

1. **Intro Animation** - Brand reveal with typewriter effect
2. **Location Prompt** - Browser will ask for location permission (optional)
3. **Homepage** - Seven journey options + Zai chat button

## Try These Journeys

### 1. Travel Journey
- Start location: "London"
- Destination: "Paris"
- Date: Tomorrow
- Group size: 2
- Priority: carbon
- Return: yes

**Result**: Compare flights, trains, and coaches

### 2. Energy Switch
- Current provider: "British Gas"
- Tariff: fixed
- Monthly cost: £100–150
- Want green: yes
- Tenure: rent
- Bundle: no

**Result**: Compare cheaper/greener energy suppliers

### 3. Profile (Full Assessment)
- Answer 14 questions about home, travel, food, shopping, waste
- **Result**: Carbon footprint breakdown + personalized tips

### 4. Chat with Zai
- Click bottom-right chat button
- Try: "how can i save money on travel?"
- **Result**: AI suggestions with action buttons

## Project Structure

```
zero-zero/
├── components/        # UI components
│   ├── IntroPage.tsx     # Welcome screen
│   ├── Homepage.tsx      # Main menu
│   ├── ChatPage.tsx      # Zai assistant
│   ├── JourneyPage.tsx   # Question flow
│   ├── ResultsPage.tsx   # Comparison cards
│   └── LikesPage.tsx     # Saved results
├── utils/
│   ├── codeWordAPI.ts    # 🔑 Mock API layer (replace for production)
│   ├── computeFootprint.ts
│   ├── buildTips.ts
│   └── locationUtils.ts
├── styles/
│   └── globals.css       # Design system
└── App.tsx            # Main app & routing
```

## Making Changes

### Add a New Journey Question

Edit `/components/JourneyPage.tsx`:

```tsx
const journeyQuestions = {
  // ... existing journeys
  myjourney: [
    { 
      text: 'what is your name?', 
      type: 'text', 
      key: 'name' 
    },
    { 
      text: 'how old are you?', 
      type: 'pills', 
      key: 'age', 
      options: ['18-25', '26-35', '36-50', '50+'] 
    }
  ]
};
```

### Customize Results Data

Edit `/App.tsx` in the `generateJourneyResults` function:

```tsx
const baseResults = {
  myjourney: [
    {
      title: 'cheapest',
      provider: 'option a',
      price: '£10',
      carbon: '5kg co₂',
      rationale: 'best value',
      cta: 'choose',
      href: 'https://example.com'
    },
    // ... more options
  ]
};
```

### Change Colors (Warning: Breaks Design!)

Edit `/styles/globals.css`:

```css
:root {
  --background: #000;  /* Keep black */
  --foreground: #fff;  /* Keep white */
}
```

**Note**: Zero Zero is strict black & white only!

## Common Tasks

### Build for Production

```bash
npm run build
```

Output in `dist/` folder

### Preview Production Build

```bash
npm run preview
```

### Clear Cache

```bash
rm -rf node_modules package-lock.json
npm install
```

### Update Dependencies

```bash
npm update
```

## Testing Locally

### Desktop Testing
- Chrome: http://localhost:3000
- Firefox: http://localhost:3000
- Safari: http://localhost:3000

### Mobile Testing (Same Network)

1. Find your computer's IP:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. On mobile browser:
   ```
   http://192.168.1.XXX:3000
   ```
   Replace XXX with your IP

## Deployment

### Deploy to Vercel (Easiest)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Click "Deploy"
5. Done! ✨

See [DEPLOYMENT.md](./DEPLOYMENT.md) for other platforms.

## Integrating Real APIs

Current state: **All APIs are mocked**

When ready for real data:

1. Read [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
2. Get API keys (OpenAI, Google Maps, etc.)
3. Update `/utils/codeWordAPI.ts` functions
4. Test with small user group
5. Deploy to production

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/yourusername/zero-zero/issues)
- **Questions**: Check existing [Discussions](https://github.com/yourusername/zero-zero/discussions)
- **Contributing**: Read [CONTRIBUTING.md](./CONTRIBUTING.md)

## Next Steps

- ✅ Run locally (`npm run dev`)
- [ ] Explore all 7 journeys
- [ ] Chat with Zai
- [ ] Save results to Likes
- [ ] Complete profile journey
- [ ] Deploy to Vercel
- [ ] Integrate first API (location)
- [ ] Share with friends!

---

Built something cool? Share it:
- Tag: `#zerozero`
- Instagram: [@percyzerozero](https://www.instagram.com/percyzerozero/)

Happy coding! 🚀🌍