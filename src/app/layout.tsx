import type { Metadata } from "next";
import { notoSerifTC, notoSansTC, playfairDisplay, inter, cormorantGaramond } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "I ME — Exosome Beauty for you",
  description:
    "人體外泌體美容科技品牌。源自台中榮總專利技術，星誠細胞生醫研發，博訊生技 CDMO 全自動化製程。每 1mL 安瓶 2,000 億顆外泌體。",
  keywords: ["外泌體", "exosome", "幹細胞", "醫美", "I ME", "星誠細胞生醫"],
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
    <html lang="zh-Hant" className={fontVars}>
      <body className="antialiased bg-ivory text-night">
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
