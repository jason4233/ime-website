import {
  Noto_Serif_TC,
  Noto_Sans_TC,
  Playfair_Display,
  Inter,
  Cormorant_Garamond,
  Bodoni_Moda,
  Fraunces,
  Jost,
} from "next/font/google";

export const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-serif-tc",
  display: "swap",
});

export const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans-tc",
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-elegant",
  display: "swap",
});

// Bodoni Moda — Vogue/Harper's Bazaar 級 display serif
// pro-max Luxury Minimalist pairing 推薦 → 做巨型數字(2,000 億 / +47% / 76.8nm)
export const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-statement",
  display: "swap",
});

// v4 Luxe — Fraunces (variable serif heading) + Jost (geometric body)
// 由 ui-ux-pro-max --design-system 推薦的 Luxury Minimalist pairing
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-luxe",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-luxe",
  display: "swap",
});
