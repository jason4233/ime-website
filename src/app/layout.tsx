import type { Metadata } from "next";
import { notoSerifTC, notoSansTC, playfairDisplay, inter, cormorantGaramond } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";
// SmoothScroll + CustomCursor 都改 dynamic ssr:false，避免 Lenis/browser extension 注入 DOM 造成 hydration mismatch (insertBefore 錯誤)
const SmoothScroll = dynamic(() => import("@/components/layout/SmoothScroll").then(m => m.SmoothScroll), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor").then(m => m.CustomCursor), { ssr: false });
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "I ME — Exosome Beauty for you｜外泌體美容保養 · 新美業品牌",
    template: "%s | I ME 外泌體美容",
  },
  description:
    "I ME 以臍帶間質幹細胞外泌體為核心的新美業品牌。星誠細胞生醫 × 博訊生技 CDMO 全自動化製程，台中榮總專利技術。INCI Mono ID 40148、TFDA 008446 醫器製字、中韓發明專利。每 1mL 安瓶含 2,000 億顆外泌體，粒徑 76.8-99.4nm，表達 CD9、CD63 標誌物。",
  keywords: [
    // 核心關鍵字
    "外泌體", "exosome", "外泌體保養", "外泌體原液", "外泌體美容", "外泌體凍晶",
    // 品牌
    "I ME", "I ME 外泌體", "I ME 美容", "I ME 品牌", "ime-beauty",
    // 原料廠
    "星誠", "星誠細胞生醫", "StellarCell", "StellarCell Bio", "修秘", "修秘晶露", "USC-E", "USC-D", "SiUPi POWDER",
    "博訊", "博訊生技", "Dr.SIGNAL", "3A-GTP", "CDMO",
    // 產業分類
    "新美業", "美業", "美容", "醫美", "抗老", "肌膚修護", "保養品", "精華液", "安瓶",
    // 技術
    "臍帶間質幹細胞", "UC-MSC", "幹細胞外泌體", "再生醫療", "細胞治療",
    // 認證
    "INCI 認證", "INCI Mono ID 40148", "TFDA 008446", "衛部醫器製字",
    // 泌容術
    "泌容術", "泌容", "外泌體療程",
    // 合作單位
    "台中榮總", "楊孟寅醫師", "星和診所",
  ],
  authors: [{ name: "I ME", url: "https://ime-beauty.com" }],
  creator: "I ME × StellarCell BioMedicine × Dr.SIGNAL",
  publisher: "I ME",
  category: "beauty, biotech, cosmetics",
  alternates: {
    canonical: "https://ime-beauty.com",
    languages: {
      "zh-TW": "https://ime-beauty.com",
      "zh-Hant": "https://ime-beauty.com",
    },
  },
  openGraph: {
    title: "I ME — Exosome Beauty for you｜外泌體美容保養新美業品牌",
    description: "捨得，才是最高級的保養。每 1mL 安瓶 2,000 億顆臍帶間質幹細胞外泌體。星誠細胞生醫 × 博訊生技 CDMO × 台中榮總楊孟寅醫師專利技術。INCI、TFDA、中韓專利認證。",
    siteName: "I ME",
    locale: "zh_TW",
    type: "website",
    url: "https://ime-beauty.com",
    images: [
      {
        url: "/images/42707_0.jpg",
        width: 1200,
        height: 630,
        alt: "I ME — Exosome Beauty for you 品牌 Logo",
      },
      {
        url: "/images/42706_0.jpg",
        width: 1200,
        height: 630,
        alt: "I ME SiUPi POWDER 外泌體凍晶 USC-E",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "I ME — 外泌體美容新美業品牌",
    description: "每 1mL 2,000 億顆外泌體。星誠細胞生醫 × 博訊生技 × 台中榮總專利技術。",
    images: ["/images/42707_0.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // TODO: 取得 Google Search Console 驗證碼後填入
    // google: "your-google-site-verification-code",
    // yandex: "...",
  },
  metadataBase: new URL("https://ime-beauty.com"),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    notoSerifTC.variable,
    notoSansTC.variable,
    playfairDisplay.variable,
    inter.variable,
    cormorantGaramond.variable,
  ].join(" ");

  return (
    <html lang="zh-Hant" className={fontVars} suppressHydrationWarning>
      <body className="antialiased bg-ivory text-night" suppressHydrationWarning>
        {/* SmoothScroll 以 dynamic ssr:false 載入，SSR 階段跳過 Lenis 包裝 */}
        <SmoothScroll>
          <CustomCursor />
        </SmoothScroll>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
