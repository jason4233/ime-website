"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { MagneticButton } from "@/components/ui/MagneticButton";

// 21st.dev Celestial Bloom Shader (dhiluxui) — 專業 WebGL shader 當 Hero 背景
// dynamic(ssr:false) 避免 WebGL SSR hydration 問題
const CelestialBloomShader = dynamic(
  () => import("@/components/ui/celestial-bloom-shader"),
  { ssr: false }
);

// 逐字動畫工具
function AnimatedText({
  text,
  className = "",
  delay = 0,
  goldChars = "",
}: {
  text: string;
  className?: string;
  delay?: number;
  goldChars?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => {
        // gold 判斷：檢查是否在 goldChars 範圍內
        const goldStart = text.indexOf(goldChars);
        const isInGoldRange = goldChars && i >= goldStart && i < goldStart + goldChars.length;

        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block ${isInGoldRange ? "text-gradient-gold" : ""}`}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}

// 合作夥伴 logos（文字版，之後可換圖）
const partners = [
  { name: "星誠細胞生醫", en: "StellarCell Bio." },
  { name: "博訊生技", en: "Dr.SIGNAL" },
  { name: "台中榮總", en: "TCVGH" },
  { name: "INCI 認證", en: "Mono ID: 40148" },
];

interface HeroData {
  headline?: string | null;
  subheadline?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

export function HeroSection({ data }: { data?: HeroData | null } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // DB 覆蓋：若 CMS 有資料，用 DB 的；否則 fallback 原硬編文字
  const cmsSubline = data?.subheadline;
  const cmsCtaText = data?.ctaText;
  const cmsCtaLink = data?.ctaLink;

  // Parallax state — 用 native scroll 取代 Framer useScroll 避免 prod hydration MotionValue null
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const h = rect.height;
      // progress: 0 = section 完整在畫面，1 = section 完全滑出
      const p = Math.max(0, Math.min(1, -rect.top / h));
      setScrollProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 線性對應（對應原本 useTransform 的 [0, 0.6] range）
  const t = Math.min(1, scrollProgress / 0.6);
  const opacity = 1 - t;
  const y = -80 * t;
  const scale = 1 - 0.05 * t;

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 21st.dev Celestial Bloom Shader 取代原金光粒子
          元件內建 position:fixed + zIndex:-1,會以全視窗大小鋪在 Hero 背景 */}
      <CelestialBloomShader />

      {/* 邊緣暗角 + 底部 fade 讓下個 section 無縫接 */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% 50%, transparent 35%, rgba(10, 5, 20, 0.5) 100%)
          `,
        }}
      >
        {/* 裝飾線 */}
        <div className="absolute top-0 left-[15%] w-px h-[35vh] bg-gradient-to-b from-brand/25 to-transparent" />
        <div className="absolute top-0 right-[22%] w-px h-[20vh] bg-gradient-to-b from-gold/20 to-transparent" />
      </div>

      {/* 主內容 */}
      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto"
      >
        {/* 主標第一行 — 辰宇落雁體 */}
        <h1 className="font-handwriting leading-[1.2] tracking-[0.08em]"
          style={{
            WebkitTextStroke: "0.3px transparent",
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            fontWeight: 300,
          }}>
          <span className="block text-ivory/95 text-[clamp(2.6rem,7.2vw,6.2rem)]">
            <AnimatedText text="捨得," delay={0.3} />
          </span>
          {/* 第二行 — 「最高級」三字墨金 */}
          <span className="block text-ivory/95 text-[clamp(2.6rem,7.2vw,6.2rem)] mt-3">
            <AnimatedText
              text="才是最高級的保養"
              delay={0.7}
              goldChars="最高級"
            />
          </span>
        </h1>

        {/* 裝飾金線 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-px bg-gold/40 mx-auto my-8 origin-center"
        />

        {/* 副標 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2"
        >
          <p className="text-[clamp(0.95rem,1.6vw,1.2rem)] text-ivory/40 font-sans-tc font-light tracking-wide leading-[1.8]">
            {cmsSubline ?? "每 1mL 安瓶 2,000 億顆外泌體。"}
          </p>
          <p className="text-[clamp(0.95rem,1.6vw,1.2rem)] text-ivory/35 font-sans-tc font-light tracking-wide leading-[1.8]">
            給捨得對自己好的妳。
          </p>
        </motion.div>

        {/* CTA — Magnetic hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <MagneticButton href={cmsCtaLink ?? "/contact"} variant="gold">
            {cmsCtaText ?? "預約泌容術體驗"}
          </MagneticButton>
          <MagneticButton href="/about" variant="ghost" className="text-ivory/40 border-ivory/10 hover:text-ivory/70 hover:border-ivory/25">
            了解外泌體原理
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* 底部合作夥伴 logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.0 }}
        className="absolute bottom-28 left-0 right-0 z-20"
      >
        <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap px-6">
          {partners.map((p) => (
            <div key={p.name} className="text-center opacity-25 hover:opacity-40 transition-opacity duration-500">
              <p className="font-elegant text-[0.65rem] text-ivory/80 tracking-[0.12em]">
                {p.en}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 底部漸層過渡到 ivory */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent z-20" />

      {/* 滾動指示 — 豎線 + 小點 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="font-elegant italic text-[0.6rem] text-ivory/20 tracking-[0.25em] uppercase">
          scroll
        </span>
        <div className="w-px h-12 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full"
            animate={{ y: ["-100%", "200%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold/60 -translate-x-[2px]" />
          </motion.div>
          <div className="w-full h-full bg-ivory/8" />
        </div>
      </motion.div>
    </section>
  );
}
