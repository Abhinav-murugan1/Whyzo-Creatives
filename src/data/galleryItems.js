import cloudinaryAssets from './cloudinaryAssets.json';
import { previewVideo, sizedAsset } from '../lib/cloudinary.js';

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
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/automotive/FERRARI_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/automotive/FERRARI.mp4',
    metrics: '4.8M Impressions // 120mph Precision Cinema',
    deliverables: ['Dynamic High-Speed Tracking', 'Anamorphic Lens Master', 'Cockpit Sound Design', 'Social Campaign Cuts'],
    description: 'High-speed track pursuit and dynamic precision tracking capturing the raw power and aerodynamic lines of the Ferrari SF90.'
  },
  {
    id: 'work-auto-02',
    title: 'McLaren Artura',
    category: 'automotive',
    categoryLabel: 'Automotive Cinema',
    client: 'McLaren Automotive',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/automotive/MCLAREN_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/automotive/MCLAREN.mp4',
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
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/automotive/URUSS_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/automotive/URUSS.mp4',
    metrics: '3.6M Views // International Campaign',
    deliverables: ['Rolling Gimbal Rigging', 'Exhaust Audio Capture', 'Color Grading Master'],
    description: 'Aggressive street and highway rolling cinema showcasing the commanding stance and twin-turbo presence of the Urus.'
  },
  {
    id: 'work-cgi-01',
    title: 'Esscents Perfume',
    category: 'cgi',
    categoryLabel: 'CGI & 3D Simulation',
    client: 'Maison Elysian Parfums',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/cgi/PERFUME_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/cgi/PERFUME.mp4',
    metrics: 'Awwwards Site Feature // 100% Fluid Dynamics Simulation',
    deliverables: ['Photorealistic 3D Bottle Model', 'Viscous Fluid Physics', 'Subsurface Glass Shading', 'Spatial Audio Mix'],
    description: 'Ultra-realistic 3D fluid simulation and refractive glass rendering demonstrating luxury fragrance diffusion in zero gravity.'
  },
  {
    id: 'work-corp-01',
    title: 'Standmakers Dubai',
    category: 'corporate',
    categoryLabel: 'Corporate & Brand Film',
    client: 'Nexus Global Exhibitions',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/corporate/STAND_BUILD_UP_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/corporate/STAND_BUILD_UP.mp4',
    metrics: '4-Day Continuous Capture // 8K Master Production',
    deliverables: ['High-Precision Timelapse', 'Motion Controlled Pan', 'B2B Case Film', 'Stakeholder Deck Video'],
    description: 'Multi-day architectural exhibition build timelapse capturing complex structural assembly and high-end lighting integration.'
  },
  {
    id: 'work-corp-02',
    title: 'Invest Web Forum',
    category: 'corporate',
    categoryLabel: 'Corporate & Brand Film',
    client: 'Apex Tech Forum',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/corporate/WEB_FORUM_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/corporate/WEB_FORUM.mp4',
    metrics: '12,000 Global Streamers // Keynote Archive',
    deliverables: ['Multi-Cam Keynote Coverage', 'Speaker Spotlight Reels', 'Live Broadcast Edit', 'Corporate Summary Film'],
    description: 'Executive keynote capture and broadcast summary for the international digital technology and innovation conference.'
  },
  {
    id: 'work-corp-03',
    title: 'Amana Healthcare & Construction',
    category: 'corporate',
    categoryLabel: 'Corporate & Brand Film',
    client: 'Amana Group',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/corporate/AMANA_FINAL_4K_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/corporate/AMANA_FINAL_4K.mp4',
    metrics: '4K Architectural Cinema // Brand Identity Showcase',
    deliverables: ['Drone Aerial Surveys', 'Engineering Precision B-Roll', 'Leadership Sound Bites', 'Corporate Master Edit'],
    description: 'Expansive 4K industrial and architectural brand film highlighting vanguard healthcare engineering and state-of-the-art facility construction.'
  },
  {
    id: 'work-corp-04',
    title: 'AWS Cloud Innovation Summit',
    category: 'corporate',
    categoryLabel: 'Corporate & Brand Film',
    client: 'Amazon Web Services',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/corporate/AWS_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/corporate/AWS.mp4',
    metrics: 'Global Tech Leaders // Enterprise Keynote',
    deliverables: ['Live Multi-Cam Switching', 'Speaker Keynotes', 'Tech Demo Recaps', 'PR Highlights Cut'],
    description: 'Dynamic cloud architecture conference documentary highlighting enterprise AI scalability and executive thought leadership.'
  },
  {
    id: 'work-event-01',
    title: 'GISEC Global Cyber Security Expo',
    category: 'events',
    categoryLabel: 'Live Events & Expos',
    client: 'Dubai World Trade Centre',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/events/GISEC_2025_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/events/GISEC_2025.mp4',
    metrics: '35,000 Delegates // Cyber Defense Summit',
    deliverables: ['Keynote & Mainstage Coverage', 'AI Security Booth Spotlights', 'Fast-Paced Motion Graphics', 'PR Package'],
    description: 'High-octane aftermovie and stage capture highlighting world-leading cyber tech breakthroughs, live hacking arenas, and global delegations at GISEC.'
  },
  {
    id: 'work-event-02',
    title: 'GITEX Global 2024 Tech Summit',
    category: 'events',
    categoryLabel: 'Live Events & Expos',
    client: 'Dubai World Trade Centre',
    year: '2024',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/events/GITEX_2024_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/events/GITEX_2024.mp4',
    metrics: '170+ Nations // Premier Tech Exhibition',
    deliverables: ['Mainstage Highlights', 'Exhibitor Spotlights', 'Sizzle Reel Master', 'Social Teasers'],
    description: 'High-impact conference montage encapsulating artificial intelligence breakthroughs, future mobility, and digital sovereignty at GITEX 2024.'
  },
  {
    id: 'work-event-03',
    title: 'GITEX Global Future Tech Highlights',
    category: 'events',
    categoryLabel: 'Live Events & Expos',
    client: 'Dubai World Trade Centre',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/events/GITEX_2025_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/events/GITEX_2025.mp4',
    metrics: '180+ Countries // World Largest Tech Event',
    deliverables: ['Conference Aftermovie', 'Robotics & AI Booth Spotlights', 'Fast-Paced Motion Graphics', 'PR Package'],
    description: 'Comprehensive documentary aftermovie capturing the breakthroughs, AI robotics showcases, and VIP delegations at GITEX.'
  },
  {
    id: 'work-event-04',
    title: 'Gang of Girls Live Event',
    category: 'events',
    categoryLabel: 'Live Events & Expos',
    client: 'GOG Collective',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/events/GANG_OF_GIRLS_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/events/GANG_OF_GIRLS.mp4',
    metrics: '4.8M Social Impressions // 22% Engagement Lift',
    deliverables: ['Dynamic Creator Vlog Cut', 'Lifestyle Fashion Sequences', 'High-Energy Audio Mix', 'Vertical Reels Suite'],
    description: 'Vibrant, high-energy fashion and lifestyle event collaboration capturing aesthetic streetwear, sisterhood vibes, and urban energy.'
  },
  {
    id: 'work-fb-01',
    title: 'AMARA Luxury Dining & Mixology',
    category: 'fb',
    categoryLabel: 'Food & Beverage Cinema',
    client: 'AMARA Hospitality',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/fb/AMARA_BISTRO_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/fb/AMARA_BISTRO.mp4',
    metrics: '2.9M Impressions // 48% Table Booking Lift',
    deliverables: ['Culinary Commercial Film', 'Artisanal Plating Stills', 'Instagram Reels Campaign', 'Signature Menu Assets'],
    description: 'Sensory gastronomy cinematography highlighting artisanal ingredients, flame searing, and bespoke cocktail mixology.'
  },
  {
    id: 'work-fb-02',
    title: 'Le Bistro Gastronomic Atmosphere',
    category: 'fb',
    categoryLabel: 'Food & Beverage Cinema',
    client: 'Le Bistro Parisien',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/fb/BISTRO_2_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/fb/BISTRO_2.mp4',
    metrics: '1.7M Views // Michelin Guide Mention',
    deliverables: ['Atmospheric Venue Cinema', 'Chef Kitchen Action Master', 'Fine Dining Audio Design'],
    description: 'Warm, moody fine-dining narrative capturing the kinetic rhythm of an elite kitchen and Parisian culinary heritage.'
  },
  {
    id: 'work-fb-03',
    title: 'MDC Reserve Wine Pour & Cellar',
    category: 'fb',
    categoryLabel: 'Food & Beverage Cinema',
    client: 'MDC Heritage Vineyards',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/fb/MDC_WINE_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/fb/MDC_WINE.mp4',
    metrics: '4K Macro Probe Lens // Sommelier Campaign',
    deliverables: ['Macro Fluid Pour Cinema', 'Sommelier Tasting Suite', 'Vintage Label Master'],
    description: 'Extreme slow-motion probe lens cinematography capturing vintage wine aeration and cellar ambience.'
  },
  {
    id: 'work-inf-01',
    title: 'Coastal Jet Ski Adrenaline Rush',
    category: 'influencer',
    categoryLabel: 'Creator & Influencer',
    client: 'Nautilus Watersports',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/influencer/JETSKI_OUT_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/influencer/JETSKI_OUT.mp4',
    metrics: '3.1M Views // Dubai Marina Campaign',
    deliverables: ['FPV Water Tracking', 'Gimbal Chase Shots', 'Color Pop Grade', 'Action Sound Mix'],
    description: 'Adrenaline-fueled water adventure tracking high-speed jet ski maneuvers along the Dubai coast with crystal-clear wake.'
  },
  {
    id: 'work-re-01',
    title: 'The Villa Luxury Architecture',
    category: 'realestate',
    categoryLabel: 'Luxury Real Estate',
    client: 'Private Luxury Estate',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/realestate/THE_VILLA_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/realestate/THE_VILLA.mp4',
    metrics: '$28M Architectural Masterpiece // Feature Showcase',
    deliverables: ['Gimbal Interior Flythrough', 'Sunset Architectural Stills', 'Bespoke Soundscape', 'VIP Presentation Cut'],
    description: 'Breathtaking architectural cinematography touring bespoke marble expanses, minimalist infinity pools, and opulent living spaces.'
  },
  {
    id: 'work-re-02',
    title: 'Tilal Al Ghaf Waterfront Villa Tour',
    category: 'realestate',
    categoryLabel: 'Luxury Real Estate',
    client: 'Majid Al Futtaim Communities',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/realestate/TILAL_NEW_YT_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/realestate/TILAL_NEW_YT.mp4',
    metrics: '$25M Lagoon Estate // Private Client Showcase',
    deliverables: ['Lagoon Aerial Flythrough', 'Steadicam Interior Master', 'Golden Hour Lighting Study', 'Digital Sales Suite'],
    description: 'Ultra-luxury architectural tour and cinematic walkthrough gliding across lagoon waterfront terraces and bespoke marble living spaces.'
  },
  {
    id: 'work-sport-01',
    title: 'Topspin Pro Tennis Tournament Cinema',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    client: 'Topspin Sports Academy',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/sports/TOPSPIN_EVENT_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/sports/TOPSPIN_EVENT.mp4',
    metrics: '4K High-Speed // 2.4M Views',
    deliverables: ['Slow-Motion Replays', 'Court Sound Foley', 'Player Spotlight Reel', 'Commercial Spot'],
    description: 'Explosive baseline serves and intense court rallies captured in ultra-high frame rates to reveal elite athletic technique.'
  },
  {
    id: 'work-sport-02',
    title: 'Topspin Athlete Showcase',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    client: 'Topspin Athletics',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/sports/TOPSPIN_ALEXA_poster.jpg',
    video: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/sports/TOPSPIN_ALEXA.mp4',
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
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/photos/WATCH.jpg',
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
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/photos/HEADPHONES.jpg',
    video: null,
    metrics: 'Global E-Commerce Launch // 3x Conversion Rate',
    deliverables: ['Product Hero Stills', 'Material Texture Macro', 'Packaging Visuals', 'Digital Campaign Assets'],
    description: 'Tactile industrial design portraiture accentuating premium lambskin leather, brushed aluminum earcups, and minimal form factor.'
  },
  {
    id: 'work-photo-03',
    title: 'Apple AirPods Max Precision Stills',
    category: 'photos',
    categoryLabel: 'Commercial Photography',
    client: 'Studio Hardware Editorial',
    year: '2026',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/photos/MC_AIRPODS.jpg',
    video: null,
    metrics: 'Publication-Ready Studio Stills // Apple Hardware',
    deliverables: ['Anodized Metal Gradient Highlights', 'Acoustic Mesh Macro', 'Strobe Contrast Lighting'],
    description: 'Ultra-refined studio still life illuminating anodized aluminum curves, digital crown detailing, and acoustic canopy texture.'
  },
  {
    id: 'work-photo-04',
    title: 'Artisanal Culinary Still Life',
    category: 'photos',
    categoryLabel: 'Commercial Photography',
    client: 'MDC Haute Cuisine',
    year: '2025',
    image: 'https://pub-2f10f2730a564fb78e256c70fd23585d.r2.dev/photos/MDC-134.jpg',
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
  photos: 'Commercial Photography'
};

/* Sub-folders under PHOTOS/ describe the work far better than the bare category does */
const FOLDER_CATEGORIES = {};

/* Hand-set names for assets whose filename says nothing useful about the client or subject */
const TITLE_OVERRIDES = {
  // Automotive
  'automotive/Comp_1_1-1': 'Desert Supercar Cinema',
  'automotive/Comp_1_2-2_1': 'Simple ONE Electric Profile',
  'automotive/FERRARI': 'Ferrari 296 GTS',
  'automotive/lmbo': 'Lamborghini Huracán',
  'automotive/MCLAREN': 'McLaren Artura',
  'automotive/URUSS': 'Lamborghini Urus',

  // CGI
  'cgi/COFFEE_CUP': 'Coffee Cup 3D Animation',
  'cgi/PERFUME': 'Esscents Perfume 3D',

  // Corporate
  'corporate/AMANA_FINAL_4K': 'Amana Healthcare & Construction',
  'corporate/AWS': 'AWS Cloud Innovation Summit',
  'corporate/STAND_BUILD_UP': 'Standmakers Dubai Build',
  'corporate/WEB_FORUM': 'Invest Web Forum Keynote',

  // Events
  'events/GANG_OF_GIRLS': 'Gang of Girls Live Event',
  'events/GISEC_2025': 'GISEC Global Cyber Security Expo',
  'events/GITEX_2024': 'GITEX Global 2024 Tech Summit',
  'events/GITEX_2025': 'GITEX Global Future Tech Highlights',
  'events/MDC_NEW_YEAR': 'MDC New Year Gala',
  'events/MIST_NEW_YEAR': 'Mist New Year Celebration',
  'events/vivala': 'Viva La Vida Music Experience',

  // Food & Beverage
  'fb/AMARA_BISTRO': 'AMARA Bistro & Mixology',
  'fb/BISTRO_2': 'Le Bistro Atmosphere',
  'fb/Dubai_mall': 'Dubai Mall Culinary Scene',
  'fb/MDC_1': 'MDC Dining Experience',
  'fb/MDC_6': 'MDC Gastronomic Symphony',
  'fb/MDC_WINE': 'MDC Heritage Wine Pour',
  'fb/NEW': 'Artisanal Haute Cuisine',

  // Influencer
  'influencer/ADIPEC': 'ADIPEC Creator Insights',
  'influencer/hansika_02_prob3': 'Hansika Brand Collaboration',
  'influencer/JETSKI_OUT': 'Coastal Jet Ski Adrenaline',
  'influencer/Outfit_brand': 'Fashion Brand Streetwear',
  'influencer/RTA': 'Dubai RTA City Experience',
  'influencer/SEI_SAADIYATH': 'Saadiyat Island Luxury Journey',
  'influencer/STARBUCKS': 'Starbucks Lifestyle Cinema',

  // Real Estate
  'realestate/THE_VILLA': 'The Villa Luxury Architecture',
  'realestate/TILAL_NEW_REEL': 'Tilal Al Ghaf Luxury Reel',
  'realestate/TILAL_NEW_YT': 'Tilal Al Ghaf Waterfront Villa Tour',

  // Sports
  'sports/TOPSPIN_3': 'Topspin Pro Baseline Drills',
  'sports/TOPSPIN_ALEXA': 'Topspin Athlete Showcase',
  'sports/TOPSPIN_EVENT': 'Topspin Pro Tennis Tournament',

  // Commercial Photography
  'photos/WATCH': 'Chronograph Horology Macro Stills',
  'photos/HEADPHONES': 'Audiophile Acoustic Studio Lookbook',
  'photos/MC_AIRPODS': 'Apple AirPods Max Precision Stills',
  'photos/DSC00850': 'Studio Commercial Frame',
  'photos/DS07240': 'Artisanal Dessert Plating',
  'photos/DSC00106': 'Bespoke Culinary Composition',
  'photos/DSC00529': 'Signature Plate Macro',
  'photos/DSC01171-Edit': 'Chef Reserve Plating',
  'photos/DSC07239': 'Gourmet Gastronomy Frame',
  'photos/DSC07249': 'Artisanal Culinary Still',
  'photos/DSC07257': 'Haute Cuisine Creation',
  'photos/DSC07258': 'Epicurean Table Composition',
  'photos/DSC07259': 'Signature Dish Macro',
  'photos/DSC07260': 'Gourmet Presentation Frame',
  'photos/DSC07270': 'Artisanal Table Setting',
  'photos/DSC07304': 'Culinary Artistry Showcase',
  'photos/IMG_1217': 'Bespoke Beverage Craft',
  'photos/IMG_1218': 'Artisanal Pour Frame',
  'photos/IMG_1221_2': 'Cocktail Mixology Still',
  'photos/IMG_1221': 'Cocktail Artistry Composition',
  'photos/MDC-131': 'Gourmet Plating Composition',
  'photos/MDC-134': 'Artisanal Culinary Still Life',
  'photos/MDC-135': 'Artisanal Bakery Texture',
  'photos/MDC-143': 'Signature Gastronomy Frame',
  'photos/MDC-165': 'Culinary Essence Stills',
  'photos/MDC-166': 'Fine Dining Plating Study',
  'photos/MDC-179': 'Artisanal Dessert Showcase',
  'photos/MDC-45': 'Rustic Dining Detail'
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
  photos: 'Commercial Still',
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

const groupLabelFor = key => FOLDER_LABELS[key] || CATEGORY_LABELS[key] || 'Commercial Photography';

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
  'realestate',
  'sports',
  'photos'
];

export const categoryRank = key => {
  const index = CATEGORY_SEQUENCE.indexOf(key);
  return index === -1 ? CATEGORY_SEQUENCE.length : index;
};

/* Locate the curated case study that already covers a manifest asset, if one exists */
const curatedFor = asset =>
  curatedWork.find(
    work =>
      (work.image && (work.image.includes(`/${asset.publicId}.`) || work.image.includes(`/${asset.publicId}_poster.`))) ||
      (work.video && work.video.includes(`/${asset.publicId}.`)),
  ) || null;

/*
 * Every publishable asset in Cloudinary/R2, in manifest order, with curated copy overlaid wherever a
 * case study covers the asset. `group` is the shelf the asset actually sits on — the
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
      !asset.publicId.startsWith('team/') &&
      (!asset.secureUrl || !asset.secureUrl.includes('cloudinary.com'))
  )
  .map(asset => {
    // All photography assets are consolidated under Commercial Photography ('photos')
    const isPhoto = asset.resourceType === 'image';
    const rawCategory = isPhoto ? 'photos' : normalizeCategory(asset.category);
    const folder = isPhoto ? 'photos' : (asset.folder || rawCategory);
    // A sub-folder may carry its own shelf (podcast) and, either way, a better card label than the category
    const category = isPhoto ? 'photos' : (FOLDER_CATEGORIES[folder] || rawCategory);
    const labelKey = isPhoto ? 'photos' : (FOLDER_LABELS[folder] ? folder : category);
    // Shelf is the top-level category; labelKey only refines the label printed on the card itself
    const shelf = { category, group: category, groupLabel: CATEGORY_LABELS[category] || 'Commercial Photography' };

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
