# 🚀 Deployment Guide - Trip Vote with SEO Optimizations

This guide covers deploying Trip Vote with all SEO enhancements to production.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Set these in your hosting platform:

```bash
# Required
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_APP_URL=https://trip-vote.vercel.app

# For local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Image Assets (See SEO_ASSETS_GUIDE.md)

Convert SVG placeholders to final PNG assets:

- [ ] `public/og-image.png` (1200x630)
- [ ] `public/favicon.ico`
- [ ] `public/icon-16x16.png`
- [ ] `public/icon-32x32.png`
- [ ] `public/apple-touch-icon.png` (180x180)
- [ ] `public/icon-192x192.png`
- [ ] `public/icon-512x512.png`
- [ ] `public/icon-192x192-maskable.png`
- [ ] `public/icon-512x512-maskable.png`
- [ ] `public/screenshot-mobile.png` (390x844)
- [ ] `public/screenshot-desktop.png` (1920x1080)

---

## 🌐 Deploying to Vercel (Recommended)

### Step 1: Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Step 2: Configure Environment Variables

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_CONVEX_URL`
3. Add `NEXT_PUBLIC_APP_URL` (your production domain)

### Step 3: Configure Convex

```bash
# Deploy Convex to production
npx convex deploy --prod

# Copy the production URL and add to Vercel env vars
```

### Step 4: Deploy

```bash
# Production deployment
vercel --prod
```

---

## 🔍 Post-Deployment Verification

### 1. Test Core Functionality

- [ ] Home page loads correctly
- [ ] Create vote session works
- [ ] Join session works
- [ ] Voting interface displays
- [ ] Results display correctly
- [ ] Real-time updates work

### 2. SEO Verification

#### A. Check Metadata

```bash
# Test with curl
curl -I https://trip-vote.vercel.app

# Should see security headers:
# - X-Frame-Options: SAMEORIGIN
# - X-Content-Type-Options: nosniff
# - Strict-Transport-Security: ...
```

#### B. Validate Robots.txt

Visit: `https://trip-vote.vercel.app/robots.txt`

Expected output:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /convex/

Sitemap: https://trip-vote.vercel.app/sitemap.xml
```

#### C. Validate Sitemap

Visit: `https://trip-vote.vercel.app/sitemap.xml`

Should show XML sitemap with URLs.

#### D. Validate Manifest

Visit: `https://trip-vote.vercel.app/manifest.json`

Should show PWA manifest JSON.

### 3. Social Sharing Tests

#### Facebook Debugger

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `https://trip-vote.vercel.app`
3. Click "Debug"
4. Verify:
   - [ ] Title shows correctly
   - [ ] Description displays
   - [ ] OG image appears (1200x630)
   - [ ] No errors or warnings

#### Twitter Card Validator

1. Go to: https://cards-dev.twitter.com/validator
2. Enter: `https://trip-vote.vercel.app`
3. Verify:
   - [ ] Card preview shows
   - [ ] Image displays correctly
   - [ ] Title and description correct

#### LinkedIn Post Inspector

1. Go to: https://www.linkedin.com/post-inspector/
2. Enter: `https://trip-vote.vercel.app`
3. Verify preview

### 4. Structured Data Validation

#### Google Rich Results Test

1. Go to: https://search.google.com/test/rich-results
2. Enter: `https://trip-vote.vercel.app`
3. Verify:
   - [ ] No errors
   - [ ] WebApplication schema detected
   - [ ] All properties valid

#### Schema.org Validator

1. Go to: https://validator.schema.org/
2. Enter: `https://trip-vote.vercel.app`
3. Check for validation errors

### 5. Mobile & PWA Tests

#### Mobile-Friendly Test

1. Go to: https://search.google.com/test/mobile-friendly
2. Enter: `https://trip-vote.vercel.app`
3. Verify: "Page is mobile friendly"

#### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://trip-vote.vercel.app --view

# Or use Chrome DevTools:
# 1. Open Chrome DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Click "Analyze page load"
```

Target Scores:

- SEO: 95-100
- Performance: 90-100
- Accessibility: 90-100
- Best Practices: 90-100
- PWA: Installable

#### PWA Install Test

1. Open on Android Chrome or iOS Safari
2. Look for "Install App" prompt
3. Test installation
4. Verify icon appears correctly

---

## 🔧 Google Search Console Setup

### Step 1: Verify Ownership

1. Go to: https://search.google.com/search-console
2. Add property: `https://trip-vote.vercel.app`
3. Choose verification method:
   - **Recommended:** DNS verification
   - Or add HTML meta tag to `app/layout.tsx`

### Step 2: Submit Sitemap

1. In Search Console, go to Sitemaps
2. Submit: `https://trip-vote.vercel.app/sitemap.xml`
3. Wait for indexing (can take 1-7 days)

### Step 3: Request Indexing

1. Go to URL Inspection
2. Enter: `https://trip-vote.vercel.app`
3. Click "Request Indexing"

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Already Installed)

- Automatically tracks Core Web Vitals
- View in Vercel Dashboard → Analytics

### Google Analytics (Optional)

Add to `app/layout.tsx` if desired:

```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

---

## 🐛 Troubleshooting

### OG Images Not Showing

1. Clear Facebook cache: https://developers.facebook.com/tools/debug/
2. Ensure images are accessible (not blocked by robots.txt)
3. Check image size (must be at least 200x200, recommended 1200x630)
4. Verify image format (PNG or JPG, not SVG for OG)

### Sitemap Not Accessible

1. Check Next.js build succeeded
2. Verify `app/sitemap.ts` exists
3. Test locally: `http://localhost:3000/sitemap.xml`
4. Check for build errors in Vercel logs

### PWA Not Installable

1. Must be HTTPS (Vercel provides this)
2. Manifest must be valid JSON
3. Icons must exist and be accessible
4. Service worker may be needed (optional with Next.js)

### Security Headers Not Applied

1. Check `next.config.ts` syntax
2. Redeploy after config changes
3. Test with: `curl -I https://your-domain.com`
4. Some headers may be overridden by Vercel

---

## 🎯 SEO Performance Targets

### Week 1-2 (Initial Indexing)

- [ ] Site indexed in Google
- [ ] Sitemap processed
- [ ] All pages crawlable
- [ ] No indexing errors

### Month 1 (Optimization)

- [ ] Lighthouse SEO score 95+
- [ ] Core Web Vitals "Good"
- [ ] All structured data valid
- [ ] Social previews working

### Month 3+ (Growth)

- [ ] Organic traffic starts
- [ ] Brand searches increase
- [ ] Social shares generate traffic
- [ ] Featured in search results

---

## 📈 Ongoing Maintenance

### Weekly

- [ ] Check Search Console for errors
- [ ] Monitor Vercel Analytics
- [ ] Review user feedback

### Monthly

- [ ] Run Lighthouse audit
- [ ] Check for broken links
- [ ] Update meta descriptions if needed
- [ ] Review and refresh OG images

### Quarterly

- [ ] Comprehensive SEO audit
- [ ] Update structured data
- [ ] Refresh keywords
- [ ] Analyze competitor SEO

---

## 📚 Resources

### Official Documentation

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Vercel Deployment](https://vercel.com/docs)
- [Convex Deployment](https://docs.convex.dev/production/hosting)

### SEO Tools

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

### Testing Tools

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema Validator](https://validator.schema.org/)
- [SSL Test](https://www.ssllabs.com/ssltest/)

---

## ✅ Final Checklist

Before going live:

- [ ] All environment variables set
- [ ] PNG images created and deployed
- [ ] Test create vote flow
- [ ] Test join vote flow
- [ ] Test voting and results
- [ ] Verify robots.txt accessible
- [ ] Verify sitemap.xml accessible
- [ ] Verify manifest.json accessible
- [ ] Test Facebook share preview
- [ ] Test Twitter card preview
- [ ] Run Lighthouse audit (95+ SEO)
- [ ] Check mobile responsiveness
- [ ] Test PWA install
- [ ] Submit sitemap to Google
- [ ] Request indexing in Search Console

---

**🎉 You're ready to launch!**

After deployment, your Trip Vote app will have:

- ✅ Professional social sharing
- ✅ Rich search results
- ✅ PWA capabilities
- ✅ Enhanced security
- ✅ Optimal performance
- ✅ Better discoverability

Good luck! 🚀
