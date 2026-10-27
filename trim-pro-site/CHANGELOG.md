# Trim-Pro site: changelog (October 26, 2026)

Everything below was applied to the 4-page "final-blue" build. Page weight went from
**3.21 MB of HTML to about 61 KB of HTML + 22 KB shared CSS + 8 KB shared JS**, with the images
now real, cacheable files in `/images/`.

## 1. Your requests

| # | Change | Where |
|---|--------|-------|
| 1 | **Home hero now uses the auto seat repair photo** (the black and red Trim-Pro leather/suede seat, the same image as the Auto upholstery card and page). The animated boat/sea SVG is gone. | `index.html`, `styles.css` |
| 2 | **Before/after sliders move on their own** (all 5, on Home, Auto and Marine). Each sweeps left and right on a slow loop, starts when it scrolls into view and stops when it leaves it or the tab is hidden. Touching, dragging, hovering or focusing a slider pauses it, and it eases back into motion 5 seconds after the visitor stops. Sliders stay still for visitors who have "reduce motion" turned on. Keyboard and drag controls still work. | `site.js` |
| 3 | **Sister company link in the "Swipe through our work" section**: (a) a pill link under the heading, "Want to see interior work? Visit our sister company, New Creations", and (b) a branded last card in the carousel with a Visit New Creations button. Both open https://newcreations.com/ in a new tab and are labelled for screen readers. | `index.html`, `styles.css` |

## 2. SEO report fixes

### High priority
- **Home H1 now carries the money terms:** "Auto & Boat Upholstery in Calgary: done right." The slogan stays and "Seats, trim and boat tops, done right." moves to the first line of the lede.
- **Home title shortened** from 81 to 55 characters: "Calgary Auto & Boat Upholstery | Seat Repair | Trim-Pro".
- **95% base64 weight removed:** all 28 embedded images are now files in `/images/` (WebP, plus PNG favicons) with descriptive names, e.g. `moomba-bow-seating-redone-white-vinyl-blue-gray-panel-after.webp`. Every image has width/height and `loading="lazy"` / `decoding="async"` (the hero image is the exception: high priority and preloaded).
- **Hero animation cost removed:** the `feTurbulence` / `feSpecularLighting` / animated-wave hero is replaced with one static, lightly blurred photo. No animated filters remain on the page.

### Medium priority
- **Home meta description** trimmed to 129 characters (limit 155 to 160) using the wording from the report.
- **og:image and Twitter cards on all 4 pages**, with 4 new 1200x630 share images (`og-share.jpg`, `og-auto-upholstery.jpg`, `og-boat-upholstery.jpg`, `og-leather-kits.jpg`), plus `og:site_name`, image size and alt text.
- **One home URL:** Home / logo / breadcrumbs / "Home" buttons on every page now link to `/`. `.htaccess` adds a 301 from `/index.html` to `/` (Apache hosts).
- **Local schema strengthened:** `@id`, `image`, `logo` and `hasMap` added to the business markup on all pages (and to each Service page's provider). Name, address and phone are unchanged so they still match the Google Business Profile.
- **sitemap.xml and robots.txt added** (robots.txt points at the sitemap).
- **Review markup:** left as is. Reviews stay visible text only, as the report advises.

### Low priority
- **`<main id="main">` landmark on all 4 pages**, plus a "Skip to main content" link. The footer now sits outside the contact band so the landmarks are clean.
- **FAQ schema** untouched (still valid on all pages).

### Keyword, heading and linking work (sections 3, 4, 5)
- Auto page: title is now "Truck Seat Repair & Auto Upholstery in Calgary | Trim-Pro" and the H1 matches.
- Leather page: title and meta now include "upholstery" ("Leather Kits & Heated Seats | Calgary Upholstery | Trim-Pro").
- Marine page: H2 now names the terms ("Boat tops, boat seats and covers in Calgary").
- Home H2s rewritten for search intent: "Boat & auto upholstery projects in Calgary", "Common truck seat, leather & boat repairs", "What Calgary customers say about us".
- Contextual in-text links: the four rows of the Common repairs table now link to the matching service page, and short links were added between the Auto and Leather pages.
- **CSS and JS moved to shared, cacheable files** (`styles.css`, `site.js`) instead of being repeated in each page.
- **Dead code deleted:** the old two-column hero rules (`.hero`, `.panel`, `.tag`), the boat animation rules, and other unused leftovers (`.svc`, `.steps`, `.brands` and similar).

## 3. Not done (and why)

| Item from the report | Status |
|---|---|
| Schema `geo` and `priceRange` | Needs your exact coordinates and price tier. I did not guess. Copy them from your Google Business Profile. |
| 600 to 900 words per service page, brand pages, truck seat / boat tarp / heated seat / RV pages, "Serving Calgary & area" | These need real details from you (materials, turnaround, prices, which nearby towns you actually serve). I did not invent claims about your business. |
| Self-hosted fonts | Fonts could not be downloaded in this environment. Still loaded from Google Fonts with `preconnect` and `display=swap`. |
| Clean URLs (`/boat-upholstery`) | Needs server redirects and a decision on hosting. Current `.html` URLs are kept so nothing already indexed breaks. |
| Inline styles (48 per page) | Minor, left alone. |
| Google Business Profile, Search Console, GA4, citations | On your side. See section 6 of the report. |

## 4. Deploy notes
1. Upload everything, keeping the `images/` folder. Replace the old `.html` files.
2. The `/` home links need a web server. If you open `index.html` straight from disk, "Home" will not resolve. Preview with any local server.
3. `.htaccess` is for Apache. On Netlify add a `_redirects` line `/index.html / 301`; on Cloudflare or Vercel add the equivalent redirect rule.
4. Submit `https://www.trim-pro.ca/sitemap.xml` in Search Console.
5. Heads-up: an older directory listing (Canpages) shows Trim-Pro at "11-5935 35th SE". If that is outdated, fix it so your name, address and phone match everywhere.
