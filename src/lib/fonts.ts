import { Noto_Serif_TC, Noto_Sans_TC, Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";

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
