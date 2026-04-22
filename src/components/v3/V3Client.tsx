"use client";

import { HeroV3 } from "./HeroV3";
import { BrandStoryV3 } from "./BrandStoryV3";
import { SectionDivider } from "./SectionDivider";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//   V3 — Oriental Atelier Homepage
//   "Sulwhasoo 人蔘暖意 + Tatcha 宣紙寧靜 + Whoo 朱砂印 + 台灣藥鋪卷軸"
//
//   目前已完成：Hero / SectionDivider / BrandStory
//   下一批：SkinLayers / Product (Living Vial 3D) / Certificate / Founder /
//         BeforeAfter / Testimonial / Appointment
// ═══════════════════════════════════════════════════════════════

export default function V3Client() {
  return (
    <main className="relative">
      {/* Version Badge — 右上角標記 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.8 }}
        className="fixed top-6 right-6 z-50 px-4 py-2 bg-ink/85 backdrop-blur-sm text-paper-cream font-elegant italic text-xs tracking-[0.3em] border border-leaf-gold/30"
        style={{ borderRadius: "2px" }}
      >
        V3 · Oriental Atelier
      </motion.div>

      {/* 1. Hero */}
      <HeroV3 />

      {/* Divider: 朱砂印章「相遇」 */}
      <SectionDivider
        variant="seal"
        sealChar="遇"
        whisper="the first chapter"
        chapter="壹 · 品牌故事"
      />

      {/* 2. BrandStory */}
      <BrandStoryV3 />

      {/* Divider: 金墨水滴 */}
      <SectionDivider variant="goldDrop" whisper="to be continued" />

      {/* Placeholder — 其他 section 下一批建置 */}
      <section className="relative bg-paper-warm paper-texture py-32 px-8">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="font-elegant italic text-ink/45 text-sm tracking-[0.45em] uppercase"
          >
            the atelier is still being built
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="font-serif-tc text-[clamp(1.6rem,3.5vw,2.6rem)] leading-relaxed text-ink font-medium"
          >
            接下來七幕仍在工坊裡,
            <br />
            細細打磨。
          </motion.h3>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="w-24 h-px bg-leaf-gold mx-auto origin-center"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
            viewport={{ once: true }}
            className="font-sans-tc font-light text-ink/65 text-[0.95rem] leading-[2] max-w-xl mx-auto"
          >
            肌膚層解剖 · 產品封瓶 · 認證印章 · 工坊團隊
            <br />
            療程見證 · 用戶耳語 · 預約邀請函
          </motion.p>

          {/* 主 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="pt-8"
          >
            <a
              href="/contact"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-vermillion text-paper-cream font-serif-tc text-base tracking-[0.32em] hover:bg-vermillion-dark transition-colors duration-500 shadow-[0_4px_28px_-4px_rgba(184,50,44,0.5)]"
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
              <span
                aria-hidden
                className="absolute inset-[3px] border border-leaf-gold/35 pointer-events-none"
                style={{ borderRadius: "1px" }}
              />
            </a>
          </motion.div>

          {/* Compare-with-v2 link */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: true }}
            className="pt-8 text-ink/30 font-elegant italic text-xs tracking-wider"
          >
            <a href="/" className="hover:text-vermillion transition-colors duration-500 border-b border-transparent hover:border-vermillion/40 pb-1">
              ← 比較舊版本(/)
            </a>
          </motion.p>
        </div>
      </section>

      {/* 底部落款 */}
      <footer className="relative bg-ink paper-texture py-20 px-8">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-paper-cream/55">
          <div className="flex items-center gap-4">
            <div className="font-elegant italic text-xs tracking-[0.4em] uppercase">
              I · ME
            </div>
            <div className="w-px h-4 bg-leaf-gold/40" />
            <div className="font-sans-tc text-xs tracking-wider">
              Exosome Beauty · 外泌體美容
            </div>
          </div>
          <div className="font-elegant italic text-[0.65rem] tracking-[0.3em] uppercase text-paper-cream/30">
            v3 · oriental atelier · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}
