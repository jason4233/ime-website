// Single source of truth for the site's canonical base URL.
// Controlled via Vercel env var NEXT_PUBLIC_SITE_URL — change there, no code edits needed.
// Fallback: current vercel.app alias (until custom domain is connected).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ime-website-kappa.vercel.app";
