/**
 * Dynamic SEO and Document Metadata Manager
 * Updates document titles, meta descriptions, and canonical URLs on page/state navigation.
 */

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://whyzocreatives.com';

const PAGE_META = {
  home: {
    title: 'Whyzo Creatives // Creative Production Company',
    description: 'Whyzo Creatives is a creative production company for brands, people and ideas that deserve more than basic content. Commercials, social content, campaigns, events and photography.',
    path: '/'
  },
  team: {
    title: 'Our Team // Whyzo Creatives',
    description: 'The people behind Whyzo Creatives - direction, design, production and development for brands, people and ideas.',
    path: '/team'
  },
  member: {
    title: 'Team Member // Whyzo Creatives',
    description: 'Selected work and production credits from the Whyzo Creatives team.',
    path: '/team'
  },
  notFound: {
    title: '404 - Page Not Found // Whyzo Creatives',
    description: 'The requested page could not be located. Return to the Whyzo Creatives portfolio.',
    path: '/404',
    noindex: true
  }
};

/* App routes the missing page as '404', so alias it onto the same entry */
PAGE_META['404'] = PAGE_META.notFound;

/* `overrides` lets a per-member portfolio page supply its own description and canonical path */
export function updatePageSEO(pageKey = 'home', customTitle = null, overrides = {}) {
  const base = PAGE_META[pageKey] || PAGE_META.home;
  const meta = { ...base, ...overrides };
  const title = customTitle || meta.title;

  // 1. Update Title
  document.title = title;

  // 2. Update Meta Description
  let descElem = document.querySelector('meta[name="description"]');
  if (descElem) {
    descElem.setAttribute('content', meta.description);
  }

  // 3. Update Canonical Link
  const canonicalHref = `${SITE_URL}${meta.path.startsWith('/') ? meta.path : `/${meta.path}`}`;
  let canonicalElem = document.querySelector('link[rel="canonical"]');
  if (canonicalElem) {
    canonicalElem.setAttribute('href', canonicalHref);
  }

  /*
   * 4. Keep the whole social card in step, not just the title. A share of a member portfolio was
   * previously sent out with the site-wide description and the home page's og:url, so every profile
   * unfurled identically.
   */
  const socialTags = [
    ['meta[property="og:title"]', title],
    ['meta[name="twitter:title"]', title],
    ['meta[property="og:description"]', meta.description],
    ['meta[name="twitter:description"]', meta.description],
    ['meta[property="og:url"]', canonicalHref]
  ];

  for (const [selector, content] of socialTags) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', content);
  }

  // 5. A missing route must not invite indexing now that it has a real URL of its own
  const robots = document.querySelector('meta[name="robots"]');
  if (robots) {
    robots.setAttribute(
      'content',
      meta.noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
  }
}
