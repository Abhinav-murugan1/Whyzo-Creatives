/*
 * The three currencies Whyzo quotes in, and the helpers for the typed budget field.
 *
 * `locale` drives Intl grouping, so an Indian client reads 12,50,000 rather than 1,250,000. `rate` is
 * only used to scale the sanity floor on a typed figure - nothing is converted for display, because
 * silently rewriting a number somebody just typed is worse than showing it under the currency they
 * picked. Rates are approximate and deliberately not fetched at runtime: this sorts an enquiry, it is
 * not a checkout, so a live FX feed would add a network dependency and a failure mode for no benefit.
 */
export const CURRENCIES = {
  USD: { code: 'USD', label: 'USD', symbol: '$', locale: 'en-US', rate: 1 },
  AED: { code: 'AED', label: 'AED', symbol: 'AED ', locale: 'en-AE', rate: 3.6725 },
  INR: { code: 'INR', label: 'INR', symbol: '₹', locale: 'en-IN', rate: 85 }
};

export const CURRENCY_ORDER = ['USD', 'AED', 'INR'];

/*
 * Region detection from the browser's own timezone, with the UI language as a fallback.
 *
 * This is deliberately not an IP geolocation lookup and not navigator.geolocation. The IP route means
 * shipping every visitor's address to a third party and taking a network round trip before the form can
 * render; the permission prompt route makes a visitor approve location access just to pick a currency,
 * which they will refuse. The timezone is already in the page, costs nothing, needs no consent and leaves no
 * data anywhere. It is only a default - the selector stays the visitor's to change.
 */
const ZONE_CURRENCY = {
  'Asia/Dubai': 'AED',
  'Asia/Kolkata': 'INR',
  'Asia/Calcutta': 'INR'
};

export const recommendCurrency = () => {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (zone && ZONE_CURRENCY[zone]) return ZONE_CURRENCY[zone];
  } catch {
    /* Intl unavailable - fall through to the language check */
  }

  const language = typeof navigator !== 'undefined' ? navigator.language || '' : '';
  if (/-IN$/i.test(language)) return 'INR';
  if (/-AE$/i.test(language)) return 'AED';

  return 'USD';
};

/*
 * Group a raw digit string for display as the client types: 250000 -> 2,50,000 in INR, 250,000 in USD.
 * The raw digits stay the source of truth; this is only ever used for what is on screen and in the
 * enquiry email, so a half-typed figure can never be mangled back into the input.
 */
export const formatCustomAmount = (digits, code) => {
  const currency = CURRENCIES[code] ?? CURRENCIES.USD;
  const clean = String(digits ?? '').replace(/\D/g, '');
  if (!clean) return '';
  return currency.symbol + new Intl.NumberFormat(currency.locale, { maximumFractionDigits: 0 }).format(Number(clean));
};

/* A budget below this is almost certainly a typo or a placeholder rather than a real figure */
const MIN_CUSTOM_USD = 100;

/* Empty is not an error - the field is optional, so only a figure that was actually typed is checked */
export const customAmountError = (digits, code) => {
  const clean = String(digits ?? '').replace(/\D/g, '');
  if (!clean) return null;

  const currency = CURRENCIES[code] ?? CURRENCIES.USD;
  if (Number(clean) < MIN_CUSTOM_USD * currency.rate) {
    return `That looks low for a production budget. Enter the full figure in ${currency.code}.`;
  }
  return null;
};
