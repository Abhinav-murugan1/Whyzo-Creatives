# Whyzo Creations // Minimalist Creative Media & Web Studio

Official production repository for **Whyzo Creations** (Whyzo Creatives) — an elite creative production team operating at the intersection of 8K commercial cinema, editorial photography, DaVinci Resolve color post-production, minimalist typography, spatial UI/UX design, generative AI video synthesis, and 60fps Three.js WebGL platform engineering.

---

## 🌐 Custom Domain & Production Setup

### Custom Domain Binding
This project is configured for **`https://whyzocreations.com`**:
- **CNAME File**: Automatically supplied in `public/CNAME` for GitHub Pages, Netlify, Vercel, and Cloudflare Pages.
- **DNS Records**:
  - **Apex Domain (`@`)**: Add `A` records pointing to your hosting provider's IP addresses (e.g. `76.76.21.21` for Vercel, or `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` for GitHub Pages).
  - **Subdomain (`www`)**: Add a `CNAME` record pointing to `whyzocreations.com` (or your platform's canonical cname host).
- **Environment Configuration**: Set `VITE_SITE_URL=https://whyzocreations.com` if overriding default base URLs.

---

## 🔍 SEO & Machine Crawlers

- **Canonical URL**: Dynamic canonical tags anchored to `https://whyzocreations.com/`.
- **Structured Data (JSON-LD)**:
  - `WebSite` Schema
  - `ProfessionalService` & `LocalBusiness` Schema (with multi-hub locations: NYC, London, Dubai, Tokyo, and 7 core creative disciplines)
  - `BreadcrumbList` Schema
- **Crawler Directives**:
  - `public/robots.txt`: Search crawler indexing and sitemap declaration.
  - `public/sitemap.xml`: XML sitemap covering all canonical pages and section anchors.
  - `public/llms.txt` & `public/llms-full.txt`: Emerging AI knowledge graph specification for LLM crawlers (ChatGPT, Claude, Perplexity).
  - `public/404.html`: Custom on-brand 404 page for static hosts.

---

## 🚀 Development & Build Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run oxlint code quality audit
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ⚡ Performance & Bundle Optimization

- **Chunk Splitting**: Heavy 3D libraries (`three`, `@react-three`), animation engines (`gsap`, `motion`), and shaders (`@paper-design/shaders`) are isolated into dedicated, browser-cacheable chunks.
- **Sourcemaps**: Production source maps are disabled for zero-leakage production deployment.
- **Lazy Loading**: Secondary routes (the Team roster and each member portfolio) and the Project Lightbox modal are code-split via `React.lazy` and `Suspense`.

### Shareable Member Portfolios

Each roster member has a standalone page at `/team/<member-id>` (for example `/team/alex-vance`), rendered by `MemberPortfolio.jsx`. The page loads directly from its URL, sets its own title, meta description and canonical link, and carries a Share control that uses the native share sheet where available and falls back to the clipboard. Roster data lives in `src/data/teamMembers.js` so a member page can be resolved straight from the URL without mounting the team index first; add a member there and its route, and its sitemap entry, follow.

This replaced the previous dossier modal, which layered a full-viewport `backdrop-blur` over the team grid and repainted it on every frame of its spring open animation — the source of the jank when opening a member card.

The founder's profile (`alex-vance`) sets `works: workCatalogue`, so it presents the entire Cloudinary library — 72 pieces across the nine Cloudinary categories (automotive, cgi, corporate, events, f&b, influencer, photos, real estate, sports), pieces inside each in manifest order. `PHOTOS/` sub-folders still label their own cards (Culinary, Nightlife, Product, Podcast) but do not become shelves of their own; `CATEGORY_SEQUENCE` in `galleryItems.js` fixes the shelf order. `MemberPortfolio` groups `works` by their `group` field and renders a pill selector (`All Work` plus one pill per category, each with a count) so a visitor picks the shelf to view; only the selected shelf's grid renders. It opens on the first category rather than the whole catalogue, which keeps the page around 2.9k px instead of 14.5k. The selector is hidden entirely when the work spans one shelf, so the three-piece rosters still render as a single unlabelled grid. The choice is tagged with the member it was made on, so navigating between profiles resolves back to that member's first shelf rather than carrying a stale category across. Catalogue entries carry no hand-written client, description or deliverables, so every one of those fields is rendered conditionally; the card's action label reads *Open Reel* for video and *Open Still* for photography.
- **Deferred WebGL Hero**: The `Beams` backdrop (and with it the entire `three` runtime, ~898 kB / 238 kB gzipped) is code-split behind `React.lazy`, so the hero headline, copy and CTAs paint without waiting on WebGL. Critical-path JavaScript drops from roughly 1.4 MB to 515 kB raw.
- **CDN Preconnect**: `res.cloudinary.com` and `images.unsplash.com` are preconnected in `index.html`, removing a DNS + TLS round trip from the first image request.

### Gallery Video Wall (`DriftWall`)

- **Decoder Virtualization**: A `<video>` element is mounted only while its tile is on stage — the gallery sits below the fold, so a cold page load now issues **zero** video requests instead of 63 (~10 MB). Decoders are released on a 6 s grace timer so the continuous drift never thrashes the DOM.
- **Right-Sized Posters**: Cloudinary poster URLs are rewritten with `w_600,c_limit`. Master frames were being shipped at up to 2560×3840 (843 kB, ~39 MB decoded) for a 250×158 tile.
- **Staged Reveal**: The wall stays hidden behind a `LOADING ARCHIVE` readout while its first posters decode, then cascades in column by column from the centre outwards. Every intro class is removed once the cascade finishes, so the resting wall carries no extra styling. Honours `prefers-reduced-motion`, and a 2.2 s cap guarantees the wall reveals even if the CDN stalls.
- **Poster Prewarm**: The first 24 posters are fetched at `fetchPriority = 'low'` on mount, so the visible stage is cache-warm before the user arrives without competing with the hero. Tiles beyond that load lazily, also at low priority.
- **Single Catalogue**: `src/data/galleryItems.js` builds one `workCatalogue` from `cloudinaryAssets.json` in manifest order, overlaying curated case-study copy wherever a publicId matches. Every item carries a `group` (its top-level Cloudinary category) and a `groupLabel`, plus a finer `categoryLabel` for the card badge that reflects the `PHOTOS/` sub-folder where there is one. `galleryItems` is that catalogue interleaved for the wall; `workCatalogueByGroup` is it split onto shelves; `sizedAsset(url, width)` caps a master for card-sized rendering.
- **Full Library, Less Repetition**: the wall draws every asset in `cloudinaryAssets.json` (72 items) rather than a hand-written subset. DriftWall deals items round-robin across its columns and then repeats each column until the stage is covered, so a short list showed the same reel four times per column; at full length each column holds 9 distinct items and repeats only twice — the minimum a seamless loop needs.
  - The 21 curated case studies keep their hand-written copy; the rest derive title, category label, year and dimensions from the Cloudinary manifest itself, so no marketing copy is invented.
  - Re-run `node scripts/uploadAllToCloudinary.cjs` to publish new footage; the manifest it writes is picked up automatically.

### Member Portfolio Background

`src/components/ui/topo-field.tsx` (shadcn `ui` alias) renders the animated topographic backdrop on each member portfolio: a 48px grid plus contour lines derived from 2D simplex noise, drawn in WebGL inside a sandboxed iframe so the shader's own script and canvas loop stay self-contained. It is fixed to the viewport rather than the page, so the shader only ever paints one screen no matter how long the page runs.

Two changes were made to the upstream component when vendoring it:

1. The light-mode colour substitution in `patchTopoField` used a double-quoted string containing raw newlines, which is not valid JavaScript. It is now a template literal with the same shader text.
2. `stripUnusedDependencies` removes the four CDN `<script src>` tags (Tailwind, Iconify, GSAP, ScrollTrigger) from the inlined document and stubs `gsap`/`ScrollTrigger`. The isolate step discards every node those libraries touch, so they were pure network cost; without the stub, `gsap.registerPlugin` throws and execution never reaches the WebGL block.

### Intro Reveal

The site has two reveal systems, both in `src/index.css`.

**Hero — its own treatment.** The headline rises word by word out of a clipping mask (`.reveal-mask` + `wzMaskRise`), the supporting copy, CTAs and metrics bar drift up out of a defocus (`.reveal-hero` + `wzHeroRise`, blur 7px to 0), and the WebGL backdrop eases in from a 1.08 scale (`.reveal-backdrop`). Staggered 120ms to 700ms. Note `.reveal-mask > :not(style)` — ShinyText emits its keyframes as a sibling `<style>` node, and forcing `display` on that paints raw CSS text into the page. The mask also wraps ShinyText in an inner `<span>`, because ShinyText sets an inline `animation` that would otherwise win over the mask rise.

**Everything else — `.reveal-in`.** `.reveal-in` runs a single rise-and-fade on mount (`wzReveal`, 0.85s, `both` fill), delayed by an inline `--reveal-delay`. No scroll listener and no animation library: it fires once per mount, so a refresh or a route change replays it. The member portfolio staggers its breadcrumb, portrait, details and work section 80ms apart and cascades the tiles 45ms apart, capped at 450ms so a 72-piece shelf still lands promptly. The team index staggers its four cards. `prefers-reduced-motion: reduce` disables every animation and clears the held state.

`components/Reveal.jsx` wraps the same animation in an IntersectionObserver for the long home page. A mount-triggered reveal is wasted below the fold — it plays out off screen and the visitor scrolls into content that has already finished. `Reveal` holds its children at `.reveal-pending` (opacity 0) until the block approaches the viewport, then swaps in `.reveal-in` once and disconnects; anything already on screen fires immediately. Applied to the About, Gallery, Services and Contact section headers and the Services split-stage.

### SEO Notes

Fixed:

- `og:image` and `twitter:image` pointed at an SVG. No major platform (Facebook, LinkedIn, X, WhatsApp, Slack) renders an SVG social card — every share unfurled with no image. `public/og-image.png` (1200x630, 48 kB) is generated from the SVG with `sharp` and referenced from the meta tags and the `ProfessionalService` JSON-LD.
- `updatePageSEO` only moved the title and canonical. `og:description`, `twitter:description` and `og:url` kept their home-page values, so every shared member portfolio unfurled with the site-wide blurb and the home URL. All five tags now move together.
- `public/404.html` carried no `robots` directive; it now sends `noindex, follow`.

- Routing moved from fragments to **real paths** (`/team`, `/team/alex-vance`). Fragments are discarded by crawlers, so every route previously collapsed onto `https://whyzocreations.com/` as one indexable URL and the per-route canonicals all resolved to the home page. Each route is now its own document with its own canonical, `og:url`, title and description. `sitemap.xml` and the `BreadcrumbList` JSON-LD were updated to match, and the menu emits real `<a href>` links for crawlers while `preventDefault` keeps navigation client-side.
- A missing route now sets `noindex, follow` at runtime, so `/whatever` cannot be indexed.

Static hosts need a rewrite for a cold load of `/team/alex-vance` to reach the app at all:

| Host | Mechanism |
| --- | --- |
| GitHub Pages | `public/404.html` re-enters `index.html` as `/?/team/alex-vance`; a decoder in `index.html` restores the path via `replaceState` before React boots |
| Netlify / Cloudflare Pages | `public/_redirects` |
| Vercel | `vercel.json` rewrites |

Old `#team/<id>` links are already in the wild, so `migrateLegacyHash()` rewrites them to the path equivalent before first render. Verified: `/?fresh=1#team/marcus-thorne` lands on `/team/marcus-thorne`.

### Asset & Delivery Cleanup

- **Fonts**: the stylesheet requested Orbitron, Sarpanch, Space Grotesk and Zen Dots alongside Poppins with every italic variant. `index.css` maps all of those families' classes back to Poppins and nothing on the site is italic, so the request is now Poppins `200..900` only — one render-blocking stylesheet at ~1 kB, 24 faces, zero italics. `public/404.html` likewise dropped its unused Space Grotesk.
- **Icons**: `apple-touch-icon` pointed at an SVG, which iOS ignores outright, and the manifest offered only an SVG. `apple-touch-icon.png` (180×180), `icon-192.png` and `icon-512.png` are rasterised from `favicon.svg` with `sharp` and wired into `index.html` and `site.webmanifest`.
- **Wordmark**: `public/logo-white.png` is the WHYZO CREATIVES mark, supplied at 1985x509 and downscaled to 800x205 (28 kB). The largest render on the site is 36 px tall, so 800 px wide still covers 3x DPI with headroom. The header and footer `width`/`height` attributes were corrected to the asset's real 3.90 aspect so the layout reservation matches. `public/logo-black.png` is unused and still carries the previous artwork.
- **Hero backdrop reveal**: `.reveal-backdrop` now sits *inside* the `Suspense` boundary. On the outer wrapper it played out against an empty div while the three.js chunk was still downloading, so the WebGL backdrop still snapped in when it finally arrived.
