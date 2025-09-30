# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Method 1: Vercel Web Interface

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Zero Zero MVP"
   git branch -M main
   git remote add origin https://github.com/yourusername/zero-zero.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your `zero-zero` repository
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Wait ~60 seconds
   - Your app is live! ✨

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd zero-zero
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name: zero-zero
# - Directory: ./
# - Override build settings? No

# Production deployment
vercel --prod
```

## Other Deployment Platforms

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Or via Netlify UI**
   - Drag and drop `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/zero-zero"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Enable Pages**
   - Go to repo Settings → Pages
   - Source: Deploy from branch `gh-pages`

### Cloudflare Pages

1. **Push to GitHub** (if not done already)

2. **Connect to Cloudflare**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Pages → Create a project
   - Connect GitHub repo

3. **Build Settings**
   - Framework: **Vite**
   - Build command: `npm run build`
   - Build output: `dist`

4. **Deploy**
   - Every push to `main` auto-deploys

## Custom Domain Setup

### Vercel

1. Go to project → Settings → Domains
2. Add your domain (e.g., `zerozero.app`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Environment Variables

**Note**: The current MVP doesn't require any environment variables!

When you integrate real APIs via `codeWordAPI.ts`, add them in platform settings:

**Vercel/Netlify/Cloudflare:**
```
OPENAI_API_KEY=sk-...
GOOGLE_MAPS_API_KEY=AIza...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJh...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
```

## Performance Optimization

### 1. Build Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Optimize images (if added later)
npm install --save-dev imagemin imagemin-webp
```

### 2. Caching Headers

**Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Netlify** (`netlify.toml`):
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. Compression

All platforms (Vercel, Netlify, Cloudflare) automatically enable:
- Gzip compression
- Brotli compression
- HTTP/2

## Monitoring & Analytics

### Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics
```

Add to `App.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  );
}
```

### Plausible Analytics (Privacy-friendly)

Add to `index.html`:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

Or use via `codeWordAPI_trackEvent()` for custom events.

## CI/CD Setup

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests (if any)
        run: npm test --if-present
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Troubleshooting

### Build Fails

**Issue**: `Cannot find module 'vite'`
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routes Not Working (404 on refresh)

**Vercel**: Auto-configured for SPA
**Netlify**: Add `_redirects` file to `public/`:
```
/*    /index.html   200
```

**GitHub Pages**: Add 404.html that redirects to index.html

### Build Too Large

```bash
# Check bundle size
npm run build -- --mode production

# Analyze
npx vite-bundle-visualizer
```

Current build size should be ~200-300KB gzipped.

### Slow Initial Load

1. Enable Vercel Edge Network (automatic)
2. Add preload hints in `index.html`:
```html
<link rel="preload" href="/assets/main.js" as="script">
```

## Post-Deployment Checklist

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic)
- [ ] Analytics tracking working
- [ ] Mobile responsiveness verified
- [ ] All journeys tested
- [ ] Chat functionality working
- [ ] Location permission prompt tested
- [ ] Likes/saves persisting correctly
- [ ] Meta tags for social sharing (optional)
- [ ] Favicon added (optional)
- [ ] Performance score >90 (Lighthouse)

## API Integration Rollout

When ready to integrate real APIs via `codeWordAPI.ts`:

1. **Phase 1**: Location services (Google Maps)
2. **Phase 2**: Chat AI (OpenAI GPT-4)
3. **Phase 3**: Travel searches (Skyscanner, Trainline)
4. **Phase 4**: Energy comparison (uSwitch API)
5. **Phase 5**: User accounts (Supabase)
6. **Phase 6**: Analytics (Plausible/Mixpanel)

Update each function in `/utils/codeWordAPI.ts` one at a time, testing thoroughly before moving to next integration.

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Cloudflare Docs**: https://developers.cloudflare.com/pages

Need help? Open an issue on GitHub!