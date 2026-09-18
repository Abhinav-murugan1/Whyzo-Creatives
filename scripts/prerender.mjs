/*
 * Writes a static HTML file per route after `vite build`.
 *
 * Why: link unfurlers (WhatsApp, Slack, iMessage, X, LinkedIn, Facebook) fetch the HTML and read the
 * meta tags. They do not execute JavaScript. Because this is an SPA, Netlify served the same
 * index.html for every route, so `updatePageSEO` - which runs in the browser - never ran for them and
 * every shared link, including each member portfolio, unfurled with the generic home card.
 *
 * Emitting dist/team/index.html and dist/team/<id>/index.html gives each route real meta in the
 * initial HTML. Netlify serves a matching static file before falling back to the SPA rewrite, so the
 * app still hydrates and takes over exactly as before.
 *
 * Run by `npm run build`. Plain Node, no dependencies.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');
const SITE_URL = process.env.VITE_SITE_URL || 'https://whyzocreatives.com';

const escapeHtml = value =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* Square portraits need a 1200x630 social crop, centred on the face */
const socialImage = url => {
  if (!url || !url.includes('/upload/')) return `${SITE_URL}/og-image.png`;
  return url.replace('/upload/', '/upload/c_fill,g_face,w_1200,h_630,f_jpg,q_auto/');
};

/*
 * The roster lives in an ESM module that imports lucide-react and a JSON manifest, which plain Node
 * cannot load without a bundler. Only four scalar fields are needed here, so they are read straight
 * out of the source. The member count is asserted below so a format change fails the build loudly
 * rather than silently shipping wrong cards.
 */
const readMembers = () => {
  const source = readFileSync(join(root, 'src/data/teamMembers.js'), 'utf8');
  const field = (block, key) => {
    const match = block.match(new RegExp(`\\n\\s*${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
    return match ? match[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\') : null;
  };

  return [...source.matchAll(/\n {4}id: '([a-z0-9-]+)',/g)].map(match => {
    const block = source.slice(match.index, match.index + 2000);
    return {
      id: match[1],
      name: field(block, 'name'),
      role: field(block, 'role'),
      bio: field(block, 'bio'),
      image: field(block, 'image')
    };
  });
};

const members = readMembers();
if (members.length !== 4 || members.some(m => !m.name || !m.role || !m.bio)) {
  throw new Error(
    `prerender: expected 4 fully-populated members, parsed ${members.length}. ` +
      'src/data/teamMembers.js format changed - update scripts/prerender.mjs.'
  );
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

/* Replace a tag's value in place, leaving the rest of the document untouched */
const setMeta = (html, pattern, value) => {
  if (!pattern.test(html)) throw new Error(`prerender: no match for ${pattern}`);
  return html.replace(pattern, (full, before, _old, after) => `${before}${escapeHtml(value)}${after}`);
};

const render = ({ path, title, description, image }) => {
  const url = `${SITE_URL}${path}`;
  let html = template;

  html = html.replace(/(<title>)([\s\S]*?)(<\/title>)/, (_m, a, _b, c) => `${a}${escapeHtml(title)}${c}`);
  html = setMeta(html, /(<meta name="description" content=")([^"]*)(")/, description);
  html = setMeta(html, /(<link rel="canonical" href=")([^"]*)(")/, url);
  html = setMeta(html, /(<meta property="og:url" content=")([^"]*)(")/, url);
  html = setMeta(html, /(<meta property="og:title" content=")([^"]*)(")/, title);
  html = setMeta(html, /(<meta property="og:description" content=")([^"]*)(")/, description);
  html = setMeta(html, /(<meta property="og:image" content=")([^"]*)(")/, image);
  html = setMeta(html, /(<meta name="twitter:title" content=")([^"]*)(")/, title);
  html = setMeta(html, /(<meta name="twitter:description" content=")([^"]*)(")/, description);
  html = setMeta(html, /(<meta name="twitter:image" content=")([^"]*)(")/, image);

  const target = path === '/' ? join(DIST, 'index.html') : join(DIST, path.slice(1), 'index.html');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  return target.replace(DIST, 'dist');
};

const routes = [
  {
    path: '/team',
    title: 'Our Team // Whyzo Creatives',
    description:
      'The people behind Whyzo Creatives - direction, design, production and development for brands, people and ideas.',
    image: `${SITE_URL}/og-image.png`
  },
  ...members.map(member => ({
    path: `/team/${member.id}`,
    title: `${member.name} // ${member.role} // Whyzo Creatives`,
    description: member.bio,
    image: socialImage(member.image)
  }))
];

for (const route of routes) {
  console.log('prerendered', render(route));
}
console.log(`prerender: ${routes.length} routes written`);
