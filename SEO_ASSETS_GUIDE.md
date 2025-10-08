# SEO Assets Guide for Trip Vote

This guide explains all the image assets needed for optimal SEO and social sharing.

## 🎨 Image Assets Required

### 1. Open Graph Image (Social Sharing)

**File:** `public/og-image.png`

- **Size:** 1200 x 630 pixels
- **Format:** PNG or JPG
- **Purpose:** Facebook, LinkedIn, Discord, and other social platforms
- **Design Tips:**
  - Include the Trip Vote logo/brand
  - Add text: "Trip Vote - Decide Your Next Travel Destination Together"
  - Use vibrant travel-themed imagery (globe, map, destinations)
  - Keep important content in the center (safe zone)
  - Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)

**Current:** SVG placeholder created at `public/og-image.svg` (convert to PNG)

### 2. Favicon Sizes

Create multiple sizes for different devices:

#### Standard Favicon

- **File:** `public/favicon.ico`
- **Sizes:** 16x16, 32x32, 48x48 (multi-resolution ICO)
- **Format:** ICO

#### PNG Icons

- `public/icon-16x16.png` - 16 x 16 pixels
- `public/icon-32x32.png` - 32 x 32 pixels

### 3. Apple Touch Icons

**File:** `public/apple-touch-icon.png`

- **Size:** 180 x 180 pixels
- **Format:** PNG
- **Purpose:** iOS home screen icon
- **Design Tips:**
  - No transparency
  - iOS automatically rounds corners
  - Don't add your own rounded corners

### 4. Android Chrome Icons (PWA)

#### Standard Icons

- `public/icon-192x192.png` - 192 x 192 pixels
- `public/icon-512x512.png` - 512 x 512 pixels

#### Maskable Icons (Adaptive)

- `public/icon-192x192-maskable.png` - 192 x 192 pixels
- `public/icon-512x512-maskable.png` - 512 x 512 pixels
- **Design Tips:**
  - Keep important content in the center 40% safe zone
  - Background should extend to edges
  - Test with [Maskable.app](https://maskable.app/)

### 5. PWA Screenshots

#### Mobile Screenshot

**File:** `public/screenshot-mobile.png`

- **Size:** 390 x 844 pixels (iPhone 14 Pro size)
- **Purpose:** PWA install prompt preview
- **Content:** Show the voting interface or world map

#### Desktop Screenshot

**File:** `public/screenshot-desktop.png`

- **Size:** 1920 x 1080 pixels
- **Purpose:** PWA install prompt preview
- **Content:** Show the full voting session with results

## 🛠️ How to Create the Assets

### Option 1: Design Tool (Figma/Canva)

1. Use the template dimensions above
2. Export as PNG with high quality
3. Optimize with [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)

### Option 2: Convert SVG Placeholders

The following SVG placeholders are provided:

- `public/og-image.svg` (1200x630)
- `public/icon.svg` (512x512)

Convert to PNG using:

```bash
# Using ImageMagick
convert og-image.svg -resize 1200x630 og-image.png
convert icon.svg -resize 512x512 icon-512x512.png

# Or use online tools:
# - CloudConvert: https://cloudconvert.com/svg-to-png
# - Convertio: https://convertio.co/svg-png/
```

### Option 3: AI Image Generation

Use AI tools like:

- Midjourney: "Travel voting app logo, globe icon, modern UI, blue gradient"
- DALL-E: "Professional app icon for travel destination voting application"
- Canva AI: Use built-in AI image generator with travel themes

## 📋 Quick Checklist

- [ ] Create `og-image.png` (1200x630) from SVG placeholder
- [ ] Create `favicon.ico` with multiple sizes
- [ ] Create `icon-16x16.png` and `icon-32x32.png`
- [ ] Create `apple-touch-icon.png` (180x180)
- [ ] Create `icon-192x192.png` and `icon-512x512.png`
- [ ] Create maskable versions (192x192 and 512x512)
- [ ] Take screenshot of mobile voting interface (390x844)
- [ ] Take screenshot of desktop results page (1920x1080)
- [ ] Optimize all PNG files for web
- [ ] Test social sharing with Facebook Debugger
- [ ] Test PWA install prompt on mobile

## 🧪 Testing Your Assets

### Social Media Preview

1. **Facebook:** https://developers.facebook.com/tools/debug/
2. **Twitter:** https://cards-dev.twitter.com/validator
3. **LinkedIn:** Post a link and check preview

### PWA & Icons

1. **Favicon:** Check in browser tab
2. **Apple Touch Icon:** Add to iOS home screen
3. **Android Icons:** Install as PWA on Android
4. **Maskable Icons:** Test at https://maskable.app/

### SEO Validation

- **Google Rich Results:** https://search.google.com/test/rich-results
- **Schema Markup:** https://validator.schema.org/
- **Mobile-Friendly:** https://search.google.com/test/mobile-friendly

## 🎨 Brand Guidelines

**Primary Colors:**

- Blue: `#3b82f6` (Light mode primary)
- Indigo: `#6366f1` (Gradient secondary)
- Slate: `#1e293b` (Dark mode primary)

**Logo Guidelines:**

- Use globe icon as primary symbol
- Include checkmark or vote indicator
- Modern, clean, professional appearance
- Works in both light and dark backgrounds

## 📱 Environment Variable

Don't forget to set your app URL:

```env
NEXT_PUBLIC_APP_URL=https://trip-vote.vercel.app
```

Or for local development:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Deployment Notes

After creating all assets:

1. Commit all image files to your repository
2. Deploy to Vercel or your hosting platform
3. Test all social sharing links
4. Submit sitemap to Google Search Console
5. Monitor in Google Analytics

## 📖 Additional Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
