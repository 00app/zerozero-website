# Zero Zero Cloudflare Worker

Production-ready API backend with real carbon calculations and live data integration.

## 🚀 Quick Deploy

```bash
# 1. Install Wrangler CLI globally
npm install -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Navigate to worker directory
cd worker

# 4. Add your Hugging Face API key (optional but recommended)
wrangler secret put HF_API_KEY
# Paste your hf_xxx key when prompted

# 5. Deploy to Cloudflare
wrangler deploy

# Output will show your Worker URL:
# ✨ https://zerozero-api.YOUR_NAME.workers.dev
```

## 📋 What's Included

### Live Data Endpoints
- **Weather** - Open-Meteo API (free, no key required)
- **Air Quality** - OpenAQ API (free, no key required)
- **Places Search** - OpenStreetMap Nominatim (free, no key required)

### Carbon & Money Calculations
- **Real UK DEFRA 2024 emission factors**
- **9 journey types** - Travel, Switch, Food, Home, Shop, Waste, Holiday, Money, Health
- **Accurate cost estimates** based on UK averages

### AI Chat
- **Hugging Face integration** for contextual responses
- **Smart fallback** to local responses if API unavailable
- **Context-aware** suggestions based on user queries

## 🔧 Configuration

### Environment Variables

Set secrets via Wrangler CLI:

```bash
# Required for AI chat
wrangler secret put HF_API_KEY

# Optional - custom model URL
wrangler secret put HF_API_URL
```

Default HF model: `distilgpt2` (fast, free tier friendly)

## 📊 API Endpoints

### Health Check
```bash
GET /health
# Returns: { ok: true, message: "Zero Zero Worker active 🚀" }
```

### Weather
```bash
GET /weather?lat=51.5074&lon=-0.1278
# Returns current weather for location
```

### Air Quality
```bash
GET /air?lat=51.5074&lon=-0.1278
# Returns AQI and pollutant levels
```

### Places Search
```bash
GET /places?q=recycling&lat=51.5074&lon=-0.1278
# Returns nearby sustainable places
```

### Tips Feed
```bash
GET /tips
# Returns curated sustainability tips
```

### Offers
```bash
GET /offers?journey=travel
# Returns relevant offers for journey type
```

### Journey Calculations
```bash
GET /journey/travel/results?mode=car&distance=100
GET /journey/switch/results?usage=medium
GET /journey/food/results?meatMeals=7&veggieMeals=7
GET /journey/home/results?size=medium
# Returns carbon footprint, savings, and recommendations
```

### AI Chat
```bash
POST /chat
Content-Type: application/json

{
  "prompt": "how can i save energy at home?"
}

# Returns AI-generated response with suggestions
```

## 🧪 Testing

Test your deployed Worker:

```bash
# Health check
curl https://zerozero-api.YOUR_NAME.workers.dev/health

# Tips
curl https://zerozero-api.YOUR_NAME.workers.dev/tips

# Journey calculation
curl "https://zerozero-api.YOUR_NAME.workers.dev/journey/travel/results?mode=car&distance=100"

# Chat
curl -X POST https://zerozero-api.YOUR_NAME.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"how to save money on energy?"}'
```

## 💰 Free Tier Limits

**Cloudflare Workers Free Tier:**
- 100,000 requests per day
- 10ms CPU time per request
- No egress fees

**External APIs (all free):**
- Open-Meteo: Unlimited
- OpenAQ: Rate limited but generous
- OpenStreetMap: Fair use policy
- Hugging Face: 30,000 chars/month

**You can handle ~3000 users/day on free tier!**

## 🔒 Security

- **CORS enabled** - Allows requests from any origin (change in production)
- **No secrets in code** - All API keys via Wrangler secrets
- **Input validation** - All parameters validated
- **Error handling** - Graceful fallbacks for all external APIs

## 📈 Monitoring

View analytics in Cloudflare dashboard:
- Request volume
- Error rates
- Response times
- Geographic distribution

## 🚀 Production Checklist

- [ ] Deploy Worker: `wrangler deploy`
- [ ] Add HF_API_KEY secret
- [ ] Test all endpoints
- [ ] Update frontend VITE_API_BASE_URL
- [ ] Set up custom domain (optional)
- [ ] Configure rate limiting (optional)
- [ ] Enable caching (optional)

## 🆘 Troubleshooting

**Deploy fails:**
```bash
# Check you're logged in
wrangler whoami

# Try logging in again
wrangler login
```

**Secrets not working:**
```bash
# List current secrets
wrangler secret list

# Delete and re-add
wrangler secret delete HF_API_KEY
wrangler secret put HF_API_KEY
```

**CORS errors:**
- Check `Access-Control-Allow-Origin` header
- Verify your frontend URL
- Test with curl first

## 📞 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Zero Zero GitHub Issues](https://github.com/yourusername/zero-zero/issues)

## 🎉 Success!

Once deployed, copy your Worker URL to the frontend:

```bash
# In your main Zero Zero project root:
echo "VITE_API_BASE_URL=https://zerozero-api.YOUR_NAME.workers.dev" >> .env

# Redeploy frontend
vercel --prod
```

Your Zero Zero MVP is now fully connected! 🚀
