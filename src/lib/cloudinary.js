/*
 * Cloudinary delivery helpers.
 *
 * Masters are stored at up to 2560x3840; anything painting them at card size must ask for a capped
 * derivative or a single page pulls tens of megabytes. `f_auto` additionally lets Cloudinary
 * negotiate WebP/AVIF from the browser's Accept header - measured 44 kB -> 25 kB on a gallery poster.
 */

/* Matches a transformation component (so_0,f_jpg,q_auto) as opposed to a version segment (v1789…) */
const TRANSFORM_TOKEN = /^[a-z]{1,3}_[^,/]+/;

/**
 * Width-cap a Cloudinary asset and let the CDN pick the best format.
 * Returns the input untouched for non-Cloudinary URLs, or when a width is already pinned.
 */
export const sizedAsset = (url, width = 800) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (/\/[wh]_\d+/.test(url)) return url;

  const splitIndex = url.indexOf('/upload/');
  const head = url.slice(0, splitIndex);
  const tail = url.slice(splitIndex + '/upload/'.length);
  const segments = tail.split('/');
  const first = segments[0] || '';

  const sizing = `w_${width},c_limit`;

  // Merge into an existing transformation component, otherwise prepend a fresh one
  if (first && !/^v\d+$/.test(first) && TRANSFORM_TOKEN.test(first)) {
    // f_jpg pins the output format and blocks WebP/AVIF negotiation
    segments[0] = `${first.replace(/\bf_jpg\b/, 'f_auto')},${sizing}`;
    if (!/\bf_/.test(segments[0])) segments[0] = `f_auto,${segments[0]}`;
    return `${head}/upload/${segments.join('/')}`;
  }

  return `${head}/upload/f_auto,q_auto,${sizing}/${tail}`;
};

/**
 * Lightweight 480p H.264 preview used for inline hover playback and the drifting gallery wall.
 * Video stays f_mp4 on purpose - it is the format with universal inline-playback support.
 */
export const previewVideo = url => {
  if (!url) return null;
  if (!url.includes('cloudinary.com') || !url.includes('/upload/')) return url;

  const mp4 = url.replace(/\.(mov|webm|mkv)$/i, '.mp4');
  if (mp4.includes('/w_480')) return mp4;
  return mp4.replace('/upload/', '/upload/w_480,q_auto:eco,vc_h264,f_mp4/');
};
