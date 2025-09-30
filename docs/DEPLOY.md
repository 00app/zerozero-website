# 🚀 Deploy Zero Zero in 2 Minutes

## Quick Deploy

### Option 1: Automated Script (Recommended)

**macOS/Linux:**
```bash
chmod +x DEPLOY_COMMANDS.sh
./DEPLOY_COMMANDS.sh
```

**Windows:**
```bash
DEPLOY_COMMANDS.bat
```

The script will:
1. ✅ Install dependencies
2. ✅ Run linter
3. ✅ Build production bundle
4. ✅ Test locally
5. ✅ Deploy to Vercel or Netlify

---

### Option 2: Manual Deploy (3 commands)

```bash
npm install       # Install dependencies
npm run build     # Build for production
vercel           # Deploy to Vercel
```

**Done!** Your app is live. 🌍

---

## Platform-Specific Instructions

### Vercel (Recommended) ⭐

**Method 1: CLI**
```bash
npm i -g vercel
vercel
```

**Method 2: GitHub + Dashboard**
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Click "Deploy"

**Settings** (auto-detected):
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### Netlify

**Method 1: CLI**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Method 2: Drag & Drop**
1. Run `npm run build`
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag `/dist` folder

**Settings** (if using GitHub):
- Build Command: `npm run build`
- Publish Directory: `dist`

---

### Cloudflare Pages

**Method 1: Dashboard**
1. Go to [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
2. Connect to GitHub repository
3. Configure build:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

---

### GitHub Pages

```bash
npm run build
npx gh-pages -d dist
```

Note: May need to configure base path in `vite.config.ts`

---

### Railway

**Method 1: CLI**
```bash
npm i -g @railway/cli
railway login
railway up
```

**Method 2: GitHub**
1. Connect repository at [railway.app](https://railway.app)
2. Auto-detects build configuration
3. Deploy

---

### Render

**Method 1: Dashboard**
1. Go to [render.com](https://render.com)
2. New Static Site
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

---

## Build Configuration

All platforms should auto-detect these settings:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node Version** | 18+ |
| **Package Manager** | npm |

---

## Environment Variables

**Current Status**: No environment variables required! ✅

The app runs standalone with mock APIs. When ready to integrate real APIs:

1. Copy template: `cp .env.example .env.local`
2. Add your API keys
3. Update `utils/codeWordAPI.ts`
4. Redeploy

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for details.

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

### Cloudflare Pages
1. Go to Custom Domains
2. Add domain (instant if using Cloudflare DNS)

---

## Troubleshooting

### Build Fails: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build Fails: TypeScript Errors
Temporarily disable strict mode in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": false
  }
}
```

### Port 3000 Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```
Or change port in `vite.config.ts`

### Deploy Fails: Out of Memory
Increase Node memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## Post-Deployment Checklist

- [ ] Test deployed URL
- [ ] Test on mobile device
- [ ] Test all 7 journeys
- [ ] Test Zai chat
- [ ] Check performance (should be <2s load time)
- [ ] Verify HTTPS is enabled
- [ ] Test in different browsers
- [ ] Add custom domain (optional)
- [ ] Set up analytics (optional)

---

## Performance Expectations

| Metric | Target | Typical |
|--------|--------|---------|
| **Build Time** | <1 min | 30-45s |
| **Bundle Size** | <500 KB | 400-450 KB (gzipped) |
| **First Load** | <2s | 1-1.5s (on 4G) |
| **Lighthouse Score** | >90 | 95+ |

---

## Next Steps

1. ✅ Deploy to production
2. 🔗 Add custom domain (optional)
3. 📊 Set up analytics (see `codeWordAPI_trackEvent`)
4. 🔌 Integrate real APIs (see `API_INTEGRATION_GUIDE.md`)
5. 🚀 Share your Zero Zero app!

---

## Support

- **Quick Start**: [DEPLOY_NOW.md](./DEPLOY_NOW.md)
- **Full Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Production Checklist**: [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
- **API Integration**: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

---

**Happy deploying!** 🎉🌍