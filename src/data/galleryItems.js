import cloudinaryAssets from './cloudinaryAssets.json';
import { previewVideo, sizedAsset } from '../lib/cloudinary';

/*
 * The gallery wall draws from every asset published to Cloudinary. The entries below are the curated
 * case studies that carry hand-written copy; everything else in the manifest is folded in afterwards
 * with metadata derived from the manifest itself, so nothing is invented.
 *
 * Feeding the wall the full library also removes the visible repetition: DriftWall spreads items
 * round-robin across its columns and then repeats each column until the stage is covered, so a short
 * list showed the same reel several times per screen.
 */
const curatedWork = [
  {
    id: 'work-auto-01',
    title: 'Ferrari 296 GTS',
    category: 'automotive',
    categoryLabel: 'Automotive Cinema',
    client: 'Scuderia Performance',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789576675/automotive/oppl7ldj0h0ebzejzkqb.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789576675/automotive/oppl7ldj0h0ebzejzkqb.mov',
    metrics: '4.8M Impressions // 120mph Precision Cinema',
    deliverables: ['Dynamic High-Speed Tracking', 'Anamorphic Lens Master', 'Cockpit Sound Design', 'Social Campaign Cuts'],
    description: 'High-speed track pursuit and dynamic precision tracking capturing the raw power and aerodynamic lines of the Ferrari SF90.'
  },
  {
    id: 'work-auto-02',
    title: 'McLaren artura',
    category: 'automotive',
    categoryLabel: 'Automotive Cinema',
    client: 'McLaren Automotive',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577408/automotive/MCLAREN.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577408/automotive/MCLAREN.mp4',
    metrics: '2.1M Organic Views // 98% Engagement Lift',
    deliverables: ['Studio Anamorphic Shoot', 'Carbon Fiber Macro Study', 'Sound Design Score', 'Vertical Reels Suite'],
    description: 'Cinematic studio and track profile highlighting sculpted carbon fiber details and aggressive engineering.'
  },
  {
    id: 'work-auto-03',
    title: 'Lamborghini Urus',
    category: 'automotive',
    categoryLabel: 'Automotive Cinema',
    client: 'Lamborghini Squadra',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577428/automotive/URUSS.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577428/automotive/URUSS.mp4',
    metrics: '3.6M Views // International Campaign',
    deliverables: ['Rolling Gimbal Rigging', 'Exhaust Audio Capture', 'Color Grading Master'],
    description: 'Aggressive street and highway rolling cinema showcasing the commanding stance and twin-turbo presence of the Urus.'
  },
  {
    id: 'work-cgi-01',
    title: 'Esscents perfume',
    category: 'cgi',
    categoryLabel: 'CGI & 3D Simulation',
    client: 'Maison Elysian Parfums',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577434/cgi/PERFUME.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577434/cgi/PERFUME.mp4',
    metrics: 'Awwwards Site Feature // 100% Fluid Dynamics Simulation',
    deliverables: ['Photorealistic 3D Bottle Model', 'Viscous Fluid Physics', 'Subsurface Glass Shading', 'Spatial Audio Mix'],
    description: 'Ultra-realistic 3D fluid simulation and refractive glass rendering demonstrating luxury fragrance diffusion in zero gravity.'
  },
  {
    id: 'work-corp-01',
    title: 'Standmakers dubai',
    category: 'corporate',
    categoryLabel: 'Corporate & Architecture',
    client: 'Nexus Global Exhibitions',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577472/corporate/opt_STAND_BUILD_UP.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577472/corporate/opt_STAND_BUILD_UP.mp4',
    metrics: '4-Day Continuous Capture // 8K Master Production',
    deliverables: ['High-Precision Timelapse', 'Motion Controlled Pan', 'B2B Case Film', 'Stakeholder Deck Video'],
    description: 'Multi-day architectural exhibition build timelapse capturing complex structural assembly and high-end lighting integration.'
  },
  {
    id: 'work-corp-02',
    title: 'Invest Web forum',
    category: 'corporate',
    categoryLabel: 'Corporate & Keynotes',
    client: 'Apex Tech Forum',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577504/corporate/opt_WEB_FORUM.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577504/corporate/opt_WEB_FORUM.mp4',
    metrics: '12,000 Global Streamers // Keynote Archive',
    deliverables: ['Multi-Cam Keynote Coverage', 'Speaker Spotlight Reels', 'Live Broadcast Edit', 'Corporate Summary Film'],
    description: 'Executive keynote capture and broadcast summary for the international digital technology and innovation conference.'
  },
  {
    id: 'work-event-01',
    title: 'Electric Odyssey Festival Carnival',
    category: 'events',
    categoryLabel: 'Live Events & Festivals',
    client: 'Odyssey Entertainment',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577509/events/CARNIVAL.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577509/events/CARNIVAL.mp4',
    metrics: '50,000 Attendees // 100% Sold Out',
    deliverables: ['Multi-Cam Stage Capture', 'Low-Light Cinema Grade', 'Dynamic Aftermovie', 'Social Teaser Clips'],
    description: 'Electrifying low-light festival aftermovie capturing neon pyrotechnics, crowd energy, and hypnotic stage performances.'
  },
  {
    id: 'work-event-02',
    title: 'Intersec Global Security Expo',
    category: 'events',
    categoryLabel: 'Live Events & Expos',
    client: 'Messe Frankfurt ME',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577517/events/INTRO_INTERSEC.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577517/events/INTRO_INTERSEC.mp4',
    metrics: '30,000 Trade Delegates // International Expo Launch',
    deliverables: ['Exhibition Opener Film', 'High-Energy Sound Design', 'LED Stage Master', 'Social Announcement'],
    description: 'High-octane opening presentation film premiered across multi-panel stage displays for the world premier security expo.'
  },
  {
    id: 'work-event-03',
    title: 'GITEX Global Future Tech Highlights',
    category: 'events',
    categoryLabel: 'Live Events & Expos',
    client: 'Dubai World Trade Centre',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577552/events/opt_GITEX_2025.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577552/events/opt_GITEX_2025.mp4',
    metrics: '180+ Countries // World Largest Tech Event',
    deliverables: ['Conference Aftermovie', 'Robotics & AI Booth Spotlights', 'Fast-Paced Motion Graphics', 'PR Package'],
    description: 'Comprehensive documentary aftermovie capturing the breakthroughs, AI robotics showcases, and VIP delegations at GITEX.'
  },
  {
    id: 'work-fb-01',
    title: 'AMARA Luxury Dining & Mixology',
    category: 'f&b',
    categoryLabel: 'Food & Beverage Cinema',
    client: 'AMARA Hospitality',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789578219/fb/AMARA.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789578219/fb/AMARA.mp4',
    metrics: '2.9M Impressions // 48% Table Booking Lift',
    deliverables: ['Culinary Commercial Film', 'Artisanal Plating Stills', 'Instagram Reels Campaign', 'Signature Menu Assets'],
    description: 'Sensory gastronomy cinematography highlighting artisanal ingredients, flame searing, and bespoke cocktail mixology.'
  },
  {
    id: 'work-fb-02',
    title: 'Le Bistro Gastronomic Atmosphere',
    category: 'f&b',
    categoryLabel: 'Food & Beverage Cinema',
    client: 'Le Bistro Parisien',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789578225/fb/BISTRO_2.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789578225/fb/BISTRO_2.mov',
    metrics: '1.7M Views // Michelin Guide Mention',
    deliverables: ['Atmospheric Venue Cinema', 'Chef Kitchen Action Master', 'Fine Dining Audio Design'],
    description: 'Warm, moody fine-dining narrative capturing the kinetic rhythm of an elite kitchen and Parisian culinary heritage.'
  },
  {
    id: 'work-fb-03',
    title: 'MDC Reserve Wine Pour & Cellar',
    category: 'f&b',
    categoryLabel: 'Food & Beverage Cinema',
    client: 'MDC Heritage Vineyards',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789578246/fb/MDC_WINE.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789578246/fb/MDC_WINE.mov',
    metrics: '4K Macro Probe Lens // Sommelier Campaign',
    deliverables: ['Macro Fluid Pour Cinema', 'Sommelier Tasting Suite', 'Vintage Label Master'],
    description: 'Extreme slow-motion probe lens cinematography capturing vintage wine aeration and cellar ambience.'
  },
  {
    id: 'work-inf-01',
    title: 'Starbucks Crafted Lifestyle Campaign',
    category: 'influencer',
    categoryLabel: 'Creator & Influencer',
    client: 'Starbucks Coffee ME',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577587/influencer/STARBUCKS.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577587/influencer/STARBUCKS.mp4',
    metrics: '5.2M Social Impressions // 18.4% Viral Share Rate',
    deliverables: ['Dynamic Creator Vlog Cut', 'Product Placement Sequence', 'High-Energy Audio Transitions', 'TikTok/Reels Master'],
    description: 'High-energy lifestyle narrative and creator collaboration elevating daily coffee rituals into cinematic brand storytelling.'
  },
  {
    id: 'work-inf-02',
    title: 'Coastal Jet Ski Adrenaline Rush',
    category: 'influencer',
    categoryLabel: 'Creator & Influencer',
    client: 'Nautilus Watersports',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577595/influencer/JETSKI_OUT.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577595/influencer/JETSKI_OUT.mov',
    metrics: '3.1M Views // Dubai Marina Campaign',
    deliverables: ['FPV Water Tracking', 'Gimbal Chase Shots', 'Color Pop Grade', 'Action Sound Mix'],
    description: 'Adrenaline-fueled water adventure tracking high-speed jet ski maneuvers along the Dubai coast with crystal-clear wake.'
  },
  {
    id: 'work-re-01',
    title: 'Joelle Raad Luxury Residence Profile',
    category: 'realestate',
    categoryLabel: 'Luxury Real Estate',
    client: 'Joelle Raad Interiors',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577606/realestate/JOELLE_RAAD.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577606/realestate/JOELLE_RAAD.mov',
    metrics: '$18M Listing Sold // Architectural Digest Showcase',
    deliverables: ['Architectural Glide Cinema', 'Golden Hour Lighting Study', 'Interior Detail Showcase', 'VIP Buyer Walkthrough'],
    description: 'Bespoke interior design showcase and architectural cinematography highlighting Italian marble, custom carpentry, and bespoke fixtures.'
  },
  {
    id: 'work-re-02',
    title: 'Palm Jumeirah Ultra-Villa Tour',
    category: 'realestate',
    categoryLabel: 'Luxury Real Estate',
    client: 'Ellington Properties',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577626/realestate/opt_VILLA.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577626/realestate/opt_VILLA.mp4',
    metrics: '$32M Waterfront Estate // Private Client Close',
    deliverables: ['Drone Aerial Flythrough', 'Steadicam Interior Master', 'Infinity Pool Sunset Cine', 'Digital Sales Suite'],
    description: 'Seamless FPV drone and steadicam tour gliding from panoramic beachfront terraces through double-height minimalist living spaces.'
  },
  {
    id: 'work-sport-01',
    title: 'Topspin Pro Tennis Cinematic Action',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    client: 'Topspin Sports Academy',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577636/sports/TOPSPIN_3.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577636/sports/TOPSPIN_3.mp4',
    metrics: '4K 120FPS High-Speed // 2.4M Views',
    deliverables: ['120FPS Slow-Motion Replays', 'Court Sound Foley', 'Player Spotlight Reel', 'Commercial Spot'],
    description: 'Explosive baseline serves and intense court rallies captured in ultra-high frame rates to reveal elite athletic technique.'
  },
  {
    id: 'work-sport-02',
    title: 'Topspin Court Intensity & Drills',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    client: 'Topspin Athletics',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/video/upload/so_0,f_jpg,q_auto/v1789577672/sports/opt_TOPSPIN.jpg',
    video: 'https://res.cloudinary.com/hbmeplwl/video/upload/v1789577672/sports/opt_TOPSPIN.mp4',
    metrics: '98% Positive Sentiment // Athlete Recruitment',
    deliverables: ['Court-Level Handheld Rig', 'Heavy Impact Sound Mix', 'Training Highlights Cut'],
    description: 'Intimate courtside tracking following rapid footwork, racket impact, and coaching intensity.'
  },
  {
    id: 'work-photo-01',
    title: 'Chronograph Horology Macro Stills',
    category: 'photos',
    categoryLabel: 'Commercial Photography',
    client: 'Vanguard Timepieces',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789577676/photos/opt_WATCH.jpg',
    video: null,
    metrics: '100MP Medium Format Studio Stills // Print Campaign',
    deliverables: ['High-Fashion Strobe Lighting', 'Focus Stacked Macro Retouch', 'Billboard Ready Masters', 'Lookbook Print Files'],
    description: 'Studio strobe lighting study capturing sapphire crystal antireflective coatings, beveled steel edges, and Swiss movement dials.'
  },
  {
    id: 'work-photo-02',
    title: 'Audiophile Acoustic Studio Lookbook',
    category: 'photos',
    categoryLabel: 'Commercial Photography',
    client: 'Aether Acoustic Labs',
    year: '2026',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789577678/photos/opt_HEADPHONES.jpg',
    video: null,
    metrics: 'Global E-Commerce Launch // 3x Conversion Rate',
    deliverables: ['Product Hero Stills', 'Material Texture Macro', 'Packaging Visuals', 'Digital Campaign Assets'],
    description: 'Tactile industrial design portraiture accentuating premium lambskin leather, brushed aluminum earcups, and minimal form factor.'
  },
  {
    id: 'work-photo-03',
    title: 'Artisanal Culinary Still Life',
    category: 'photos',
    categoryLabel: 'Editorial Photography',
    client: 'MDC Haute Cuisine',
    year: '2025',
    image: 'https://res.cloudinary.com/hbmeplwl/image/upload/v1789577679/photos/MDC-134.jpg',
    video: null,
    metrics: 'Culinary Arts Award Feature // Editorial Cover',
    deliverables: ['Moody Chiaroscuro Lighting', 'Natural Texture Framing', 'High-Res Print Masters'],
    description: 'Chiaroscuro still-life composition exploring natural culinary textures, organic produce, and Michelin-tier plating.'
  }
];

/* 'f&b' and 'fb' are the same shelf - the upload script wrote both spellings */
const normalizeCategory = category => (category === 'f&b' ? 'fb' : category);

const CATEGORY_LABELS = {
  automotive: 'Automotive Cinema',
  cgi: 'CGI & 3D Simulation',
  corporate: 'Corporate & Brand Film',
  events: 'Live Events & Expos',
  influencer: 'Creator & Influencer',
  realestate: 'Luxury Real Estate',
  sports: 'Sports & Athletics',
  fb: 'Food & Beverage Cinema',
  photos: 'Commercial Photography',
  podcast: 'Podcast & Longform'
};

/* Sub-folders under PHOTOS/ describe the work far better than the bare category does */
/*
 * PHOTOS/PODCAST holds long-form video, not photography, so it is lifted out of the photos shelf and
 * filed under its own category instead of sitting beside the stills.
 */
const FOLDER_CATEGORIES = {
  'photos/podcast': 'podcast'
};

/* Hand-set names for assets whose filename says nothing useful about the client or subject */
const TITLE_OVERRIDES = {
  'automotive/lmbo': 'Lamborghini',
  'automotive/Comp_1_2-2_1': 'Simple Electric Scooter',
  'corporate/opt_AMANA_FINAL_4K': 'Amana Group of Companies',
  'corporate/opt_AWS': 'Proximity Works'
};

const FOLDER_LABELS = {
  'photos/fb': 'Culinary Photography',
  'photos/party': 'Nightlife Photography',
  'photos/product': 'Product Photography',
  'photos/podcast': 'Podcast & Longform'
};

/* Fallback titles for camera-roll filenames that carry no meaning of their own */
const GENERIC_TITLES = {
  'photos/fb': 'Culinary Still',
  'photos/party': 'Nightlife Frame',
  'photos/product': 'Product Study',
  'photos/podcast': 'Podcast Feature',
  photos: 'Studio Still',
  automotive: 'Automotive Sequence',
  corporate: 'Corporate Sequence',
  events: 'Event Sequence',
  fb: 'Culinary Sequence',
  influencer: 'Creator Sequence',
  realestate: 'Property Sequence',
  sports: 'Athletics Sequence',
  cgi: 'CGI Sequence'
};

/* DSC00106.JPG, IMG_1218.JPG, MDC-131.jpg, Comp 1_1-1.mp4 - all camera/NLE output, not titles */
const CAMERA_FILENAME = /^(dsc|ds|dscf|img|_mg|comp|mdc-)[\s_-]*\d*/i;

/*
 * Source filenames are shouted in full caps, so their casing carries no signal about what is really an
 * acronym. Anything genuinely initialised has to be listed; everything else gets sentence casing.
 */
const ACRONYMS = new Set(['MCD', 'MDC', 'AWS', 'RTA', 'SEI', 'MC', 'YT', 'CGI', 'FPV', 'AI', 'VIP', 'UAE', 'GITEX', 'GISEC', 'ADIPEC']);
const MINOR_WORDS = new Set(['of', 'and', 'the', 'in', 'on', 'at', 'to', 'a', 'an', 'for', 'with']);
const UNIT_TOKEN = /^\d+[a-z]$/i; // 4K, 8K
/* Stems that survive cleaning but still say nothing about the work */
const EMPTY_TITLE = /^(new|final|out|copy|untitled|render|export)$/i;

const titleFromFilename = filename => {
  const stem = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!stem || EMPTY_TITLE.test(stem)) return null;

  return stem
    .split(' ')
    .map((token, index) => {
      const upper = token.toUpperCase();
      if (ACRONYMS.has(upper) || UNIT_TOKEN.test(token)) return upper;
      if (/^\d+$/.test(token)) return token;

      const lower = token.toLowerCase();
      if (index > 0 && MINOR_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
};

/* The Cloudinary version segment is the upload timestamp, so the year is a fact rather than a guess */
const yearFromUrl = url => {
  const match = /\/v(\d{9,})\//.exec(url || '');
  return match ? String(new Date(Number(match[1]) * 1000).getFullYear()) : '2026';
};

const metricsFromAsset = asset => {
  const dimensions = asset.width && asset.height ? `${asset.width}x${asset.height}` : null;
  const runtime = asset.duration ? `${Math.round(asset.duration)}s` : null;
  return [dimensions, runtime].filter(Boolean).join(' // ') || undefined;
};

const genericCounters = {};
const genericTitle = key => {
  genericCounters[key] = (genericCounters[key] || 0) + 1;
  return `${GENERIC_TITLES[key] || 'Studio Frame'} ${String(genericCounters[key]).padStart(2, '0')}`;
};

const groupLabelFor = key => FOLDER_LABELS[key] || CATEGORY_LABELS[key] || 'Studio Production';

/*
 * The nine shelves the work is filed under, in the order they are presented. Cloudinary sub-folders
 * under PHOTOS/ (fb, party, podcast, product) still label their own cards, but they all belong to the
 * photos shelf rather than standing as shelves of their own.
 */
export const CATEGORY_SEQUENCE = [
  'automotive',
  'cgi',
  'corporate',
  'events',
  'fb',
  'influencer',
  'photos',
  'podcast',
  'realestate',
  'sports'
];

export const categoryRank = key => {
  const index = CATEGORY_SEQUENCE.indexOf(key);
  return index === -1 ? CATEGORY_SEQUENCE.length : index;
};

/* Locate the curated case study that already covers a manifest asset, if one exists */
const curatedFor = asset =>
  curatedWork.find(
    work =>
      (work.image && work.image.includes(`/${asset.publicId}.`)) ||
      (work.video && work.video.includes(`/${asset.publicId}.`)),
  ) || null;

/*
 * Every publishable asset in Cloudinary, in manifest order, with curated copy overlaid wherever a
 * case study covers the asset. `group` is the Cloudinary shelf the asset actually sits on — the
 * PHOTOS/ sub-folder where there is one, the category otherwise — so a profile can present the work
 * exactly as it is filed. Curated entries carry their own richer `categoryLabel` for the card badge,
 * which is why grouping keys off `group` rather than that label.
 */
export const workCatalogue = Object.values(cloudinaryAssets)
  .filter(
    asset =>
      asset.publicId &&
      asset.category &&
      asset.category !== 'general' &&
      asset.category !== 'team' &&
      asset.folder !== 'team' &&
      !asset.publicId.startsWith('team/')
  )
  .map(asset => {
    const rawCategory = normalizeCategory(asset.category);
    const folder = asset.folder || rawCategory;
    // A sub-folder may carry its own shelf (podcast) and, either way, a better card label than the category
    const category = FOLDER_CATEGORIES[folder] || rawCategory;
    const labelKey = FOLDER_LABELS[folder] ? folder : category;
    // Shelf is the top-level category; labelKey only refines the label printed on the card itself
    const shelf = { category, group: category, groupLabel: CATEGORY_LABELS[category] || 'Studio Production' };

    const curated = curatedFor(asset);
    if (curated) return { ...curated, ...shelf };

    const filename = asset.originalFile || '';
    return {
      id: `work-${asset.publicId.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
      title:
        TITLE_OVERRIDES[asset.publicId] ||
        (CAMERA_FILENAME.test(filename) ? null : titleFromFilename(filename)) ||
        genericTitle(labelKey),
      ...shelf,
      categoryLabel: groupLabelFor(labelKey),
      year: yearFromUrl(asset.secureUrl),
      image: asset.posterUrl,
      video: asset.resourceType === 'video' ? asset.secureUrl : null,
      metrics: metricsFromAsset(asset)
    };
  });

/*
 * Deal the categories out round-robin so neighbouring tiles on the wall are never the same subject.
 * Curated entries lead their category, so the strongest work surfaces first in every column.
 */
const interleaveByCategory = items => {
  const groups = new Map();
  for (const item of items) {
    const key = normalizeCategory(item.category);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  const lists = [...groups.values()];
  const deepest = lists.reduce((max, list) => Math.max(max, list.length), 0);
  const ordered = [];

  for (const [key, list] of groups) {
    for (let i = 0; i < deepest; i++) {
      if (list[i]) list[i] = { ...list[i], category: key };
    }
  }

  for (let i = 0; i < deepest; i++) {
    for (const list of lists) {
      if (list[i]) ordered.push(list[i]);
    }
  }

  return ordered;
};

export const galleryItems = interleaveByCategory(workCatalogue);

/*
 * Cloudinary serves masters at up to 2560x3840. Any surface that paints a catalogue image at card
 * size must ask for a capped derivative instead, or a single page pulls tens of megabytes.
 */
export { sizedAsset };

/*
 * Lightweight 480p preview derivative, matching what the gallery wall streams. Masters run to tens of
 * megabytes, so anything that plays inline on hover must request this instead.
 */
export { previewVideo };

/* Catalogue split onto its nine Cloudinary shelves, shelves in CATEGORY_SEQUENCE order */
export const workCatalogueByGroup = workCatalogue
  .reduce((groups, item) => {
    const existing = groups.find(group => group.key === item.group);
    if (existing) existing.items.push(item);
    else groups.push({ key: item.group, label: item.groupLabel, items: [item] });
    return groups;
  }, [])
  .sort((a, b) => categoryRank(a.key) - categoryRank(b.key));

export default galleryItems;
