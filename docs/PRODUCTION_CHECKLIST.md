# Production Deployment Checklist

Use this checklist before deploying Zero Zero to production.

## Pre-Deployment

### Code Quality
- [ ] No console.errors in browser console
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All journeys tested and working
- [ ] Chat functionality responds correctly
- [ ] Location permission prompt works
- [ ] Results page displays correctly
- [ ] Likes page saves/removes items
- [ ] Navigation (back/home buttons) works throughout

### Performance
- [ ] Run Lighthouse audit (target: 90+ score)
- [ ] Check bundle size (`npm run build` - should be <500KB gzipped)
- [ ] Test on slow 3G network
- [ ] Images optimized (if any added)
- [ ] No memory leaks (Chrome DevTools Memory profiler)

### Accessibility
- [ ] Keyboard navigation works on all pages
- [ ] Focus indicators visible
- [ ] Screen reader tested (VoiceOver on Mac, NVDA on Windows)
- [ ] Color contrast verified (black/white = perfect!)
- [ ] Respects `prefers-reduced-motion`
- [ ] All interactive elements have proper ARIA labels

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Responsive Design
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 1024px)
- [ ] Desktop (1025px+)
- [ ] No horizontal scroll
- [ ] Touch targets minimum 44px
- [ ] Text readable without zoom

### Content Review
- [ ] All text lowercase (Zero Zero style)
- [ ] No Lorem Ipsum placeholders
- [ ] Links open in correct tabs
- [ ] External links use `target="_blank" rel="noopener noreferrer"`
- [ ] Mock data is realistic and helpful
- [ ] No offensive or inappropriate content

## Configuration

### Environment Setup
- [ ] `.gitignore` includes `node_modules/`, `dist/`, `.env`
- [ ] No API keys committed to repo
- [ ] `package.json` has correct name, version, author
- [ ] LICENSE file present (MIT)
- [ ] README.md complete and accurate

### Meta Tags (Optional but Recommended)

Add to `index.html`:

```html
<!-- Primary Meta Tags -->
<title>Zero Zero - Save Money, Cut Carbon</title>
<meta name="title" content="Zero Zero - Save Money, Cut Carbon">
<meta name="description" content="Make better decisions for your wallet and the planet. Compare travel, switch energy, reduce waste.">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://zerozero.app/">
<meta property="og:title" content="Zero Zero - Save Money, Cut Carbon">
<meta property="og:description" content="Make better decisions for your wallet and the planet.">
<meta property="og:image" content="https://zerozero.app/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://zerozero.app/">
<meta property="twitter:title" content="Zero Zero - Save Money, Cut Carbon">
<meta property="twitter:description" content="Make better decisions for your wallet and the planet.">
<meta property="twitter:image" content="https://zerozero.app/og-image.png">

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/favicon.png">
```

### Favicon
- [ ] Create favicon.svg (black/white minimal design)
- [ ] Create favicon.png (32x32 fallback)
- [ ] Add to `/public` folder
- [ ] Test favicon appears in browser tab

## Deployment Platform

### Vercel (Recommended)
- [ ] Project imported to Vercel
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Framework preset: Vite
- [ ] Auto-deploy on `main` branch enabled
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)

### Alternative: Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] `_redirects` file added for SPA routing

### Alternative: Cloudflare Pages
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Framework: Vite

## Post-Deployment

### Verification
- [ ] Production URL loads successfully
- [ ] All pages accessible
- [ ] HTTPS enabled (padlock icon)
- [ ] No mixed content warnings
- [ ] Forms submit correctly
- [ ] Chat responds to messages
- [ ] Location permission works
- [ ] Results generate properly

### Performance Monitoring
- [ ] Vercel Analytics enabled (optional)
- [ ] Plausible Analytics configured (optional)
- [ ] Error tracking set up (Sentry optional)
- [ ] Uptime monitoring (UptimeRobot optional)

### SEO (Optional)
- [ ] Submit sitemap to Google Search Console
- [ ] Add robots.txt
- [ ] Verify meta descriptions
- [ ] Test social sharing cards

## Going Live

### Communication
- [ ] Announce on social media
- [ ] Share link with beta testers
- [ ] Collect initial feedback
- [ ] Monitor error logs

### Documentation
- [ ] README.md reflects production state
- [ ] API_INTEGRATION_GUIDE.md ready for future APIs
- [ ] CONTRIBUTING.md encourages community involvement

## API Integration (When Ready)

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for detailed steps.

### Priority 1: Low-Risk, High-Value
- [ ] Location services (Google Maps)
- [ ] Analytics (Plausible/Mixpanel)
- [ ] Error tracking (Sentry)

### Priority 2: Core Features
- [ ] Chat AI (OpenAI GPT-4)
- [ ] Travel search (Kiwi.com, Trainline)
- [ ] Energy comparison (uSwitch API)

### Priority 3: Scale Features
- [ ] User authentication (Supabase)
- [ ] Database persistence (Supabase)
- [ ] Email notifications (Resend)
- [ ] SMS notifications (Twilio)

## Maintenance

### Regular Tasks
- [ ] Review error logs weekly
- [ ] Update dependencies monthly (`npm update`)
- [ ] Test on new browser versions
- [ ] Check bundle size doesn't balloon
- [ ] Review user feedback

### Security
- [ ] Rotate API keys quarterly
- [ ] Monitor for security advisories (`npm audit`)
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable Vercel/Netlify security headers

## Rollback Plan

If deployment fails:

```bash
# Revert to previous deployment (Vercel)
vercel rollback

# Or redeploy specific commit
vercel --prod

# Netlify: Use web UI to rollback
```

## Support Contacts

- **Platform Issues**: Vercel/Netlify/Cloudflare support
- **Code Issues**: GitHub Issues
- **API Issues**: See API_INTEGRATION_GUIDE.md
- **Security Issues**: Email security@zerozero.app (set this up!)

## Success Metrics

Track these after launch:

- [ ] Daily active users
- [ ] Journeys completed
- [ ] Results viewed
- [ ] Items saved to Likes
- [ ] Chat messages sent
- [ ] Page load time (target: <2s)
- [ ] Bounce rate (target: <40%)
- [ ] Mobile vs desktop split

## Emergency Contacts

- **Hosting**: Vercel support, Netlify support
- **Domain**: Registrar support
- **APIs**: See individual API dashboards

---

## Final Check

- [ ] I have tested the app thoroughly
- [ ] All links work
- [ ] Performance is acceptable
- [ ] No errors in console
- [ ] Responsive on all devices
- [ ] Accessibility verified
- [ ] Documentation complete

## Deploy!

```bash
git push origin main
```

Or click "Deploy" in Vercel/Netlify UI.

🚀 **Good luck!** 🌍

---

After deployment, celebrate:
- Share on social media
- Tag #zerozero
- Instagram: [@percyzerozero](https://www.instagram.com/percyzerozero/)

Then start working on API integrations to make it even better!