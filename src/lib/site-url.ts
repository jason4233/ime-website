// Single source of truth for the site's canonical base URL.
// Controlled via Vercel env var NEXT_PUBLIC_SITE_URL — change there, no code edits needed.
// Fallback: current vercel.app alias (until custom domain is connected).
//
// .trim() + strip trailing slashes — Vercel 有時會在 env 值尾端多存一個 '\n'，
// 若沒清掉會變成 "https://xxx.com\n/about" 這種無效 URL（破壞 SEO）。
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ime-website-kappa.vercel.app"
)
  .trim()
  .replace(/\/+$/, "");
