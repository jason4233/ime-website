"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { InkSeal } from "./InkSeal";

const HeroParticles = dynamic(
  () => import("@/components/ui/hero-particles").then((m) => m.HeroParticles),
  { ssr: false }
);

// ═══════════════════════════════════════════════════════════════
//   HeroV3 — Oriental Atelier Hero
//   • 深茄紫底 + 紙紋 overlay
//   • Remotion ambient video（紫霧/金塵）+ 粒子匯聚光束
//   • 左:中文直排副標（傳統書冊右起）
//   • 右:Cormorant Garamond 義大利斜體 display「Exosome Beauty」
//   • 朱砂印章浮在標題上方
//   • 我想預約:朱砂紅方按鈕 + 金色邊
// ═══════════════════════════════════════════════════════════════

export function HeroV3() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-aubergine-deep">
      {/* 紙紋 overlay */}
      <div className="absolute inset-0 paper-texture opacity-[0.18] mix-blend-overlay z-[2] pointer-events-none" />

      {/* Remotion ambient video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        src="/videos/hero-ambient.mp4"
        className="absolute inset-0 w-full h-full object-cover z-[1] pointer-events-none"
        style={{ mixBlendMode: "screen", opacity: 0.62 }}
      />

      {/* 粒子匯聚光束 */}
      <HeroParticles
        className="absolute inset-0 z-[3]"
        quantity={160}
        baseSize={2.2}
        speed={0.0068}
        colorA="#D4B36A"
        colorB="#9B5DD4"
        maxZ={4.2}
        mouseInfluence={0.32}
        glow={14}
      />

      {/* 中央緩呼吸光暈 — 柔化背景、強化中央 */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none animate-slow-breathe"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(201, 166, 107, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* 金絲裝飾豎線 */}
      <div className="absolute top-0 left-[8%] w-px h-[38vh] bg-gradient-to-b from-leaf-gold/35 to-transparent z-[5] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-px h-[28vh] bg-gradient-to-t from-vermillion/30 to-transparent z-[5] pointer-events-none" />

      {/* ───────── 主內容 ───────── */}
      <div className="relative z-[10] w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-12 md:gap-20 px-8 md:px-16 py-24">
        {/* 左:中文直排 + 金線 */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex flex-col items-center gap-8 pr-12 border-r border-leaf-gold/25"
        >
          <p
            className="font-serif-tc text-paper-cream/85 text-[clamp(1rem,1.3vw,1.18rem)] tracking-[0.5em] leading-loose"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            外泌體 · 新美業
          </p>
          <div className="w-px h-12 bg-leaf-gold/45" />
          <p className="font-elegant italic text-leaf-goldLight/70 text-[0.7rem] tracking-[0.4em]">
            EXOSOME
          </p>
        </motion.aside>

        {/* 右:主標 + CTA */}
        <div className="flex flex-col items-start max-w-xl">
          {/* 朱砂印章 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-10"
          >
            <InkSeal size={68} char="泌" subtitle="I·ME" delay={0.45} />
          </motion.div>

          {/* Display 英文主標 — Cormorant Garamond italic */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-elegant italic text-paper-cream ink-bleed"
            style={{
              fontSize: "clamp(4rem, 14vw, 11rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.022em",
              fontWeight: 400,
            }}
          >
            Exosome
            <br />
            <span
              className="italic text-leaf-gold"
              style={{ fontSize: "0.78em", letterSpacing: "-0.01em" }}
            >
              Beauty
            </span>
            <span className="text-paper-cream/50 italic" style={{ fontSize: "0.5em" }}>
              .
            </span>
          </motion.h1>

          {/* 中文主標 */}
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-tc font-medium text-paper-cream/95 mt-7"
            style={{
              fontSize: "clamp(1.25rem, 2.2vw, 1.85rem)",
              letterSpacing: "0.2em",
              lineHeight: 1.55,
            }}
          >
            捨得 · 最高級的保養
          </motion.h2>

          {/* 裝飾金線 */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-28 h-px bg-leaf-gold my-9 origin-left"
          />

          {/* 副標 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="space-y-1.5"
          >
            <p className="font-sans-tc font-light text-paper-cream/80 text-[clamp(0.95rem,1.4vw,1.15rem)] tracking-wider leading-[1.95]">
              每 1 mL 安瓶 · 2,000 億顆外泌體
            </p>
            <p className="font-sans-tc font-light text-paper-cream/55 text-[clamp(0.95rem,1.4vw,1.15rem)] tracking-wider">
              給捨得對自己好的妳
            </p>
          </motion.div>

          {/* CTA 朱砂紅方按鈕 + 金邊 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-start gap-7"
          >
            <a
              href="#appointment"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-vermillion text-paper-cream font-serif-tc text-base tracking-[0.32em] hover:bg-vermillion-dark transition-colors duration-500 shadow-[0_4px_28px_-4px_rgba(164,44,46,0.5)]"
              style={{ borderRadius: "2px" }}
            >
              <span className="relative z-10">我想預約</span>
              <svg
                className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M1 8h13M10 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* 金絲內邊 */}
              <span
                aria-hidden
                className="absolute inset-[3px] border border-leaf-gold/35 pointer-events-none"
                style={{ borderRadius: "1px" }}
              />
            </a>

            <a
              href="#science"
              className="font-elegant italic text-paper-cream/65 text-sm tracking-widest hover:text-leaf-goldLight transition-colors duration-500 pt-4 border-b border-transparent hover:border-leaf-gold/40 pb-1"
            >
              了解外泌體原理 →
            </a>
          </motion.div>

          {/* 底部小字 — 認證背書 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 3.3 }}
            className="mt-16 flex items-center gap-6 text-paper-cream/35 font-elegant italic text-[0.7rem] tracking-[0.25em]"
          >
            <span>INCI · 40148</span>
            <span className="w-1 h-1 rounded-full bg-leaf-gold/40" />
            <span>TFDA · 008446</span>
            <span className="w-1 h-1 rounded-full bg-leaf-gold/40" />
            <span>台中榮總 · 專利技術</span>
          </motion.div>
        </div>
      </div>

      {/* 底部 fade to paper-cream */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-paper-cream via-paper-cream/40 to-transparent z-[6] pointer-events-none" />

      {/* Scroll 指示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2"
      >
        <span className="font-elegant italic text-[0.65rem] text-paper-cream/30 tracking-[0.35em] uppercase">
          scroll
        </span>
        <div className="w-px h-14 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full"
            animate={{ y: ["-110%", "220%"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-[3px] h-[3px] rounded-full bg-leaf-gold/80 -translate-x-[1px]" />
          </motion.div>
          <div className="w-full h-full bg-paper-cream/10" />
        </div>
      </motion.div>
    </section>
  );
}
