"use client";

import { motion } from "framer-motion";
import { HeroV3 } from "./HeroV3";
import { BrandStoryV3 } from "./BrandStoryV3";
import { SkinLayersV3 } from "./SkinLayersV3";
import { ProductV3 } from "./ProductV3";
import { CertificateV3 } from "./CertificateV3";
import { FounderV3 } from "./FounderV3";
import { BeforeAfterV3 } from "./BeforeAfterV3";
import { TestimonialV3 } from "./TestimonialV3";
import { AppointmentV3 } from "./AppointmentV3";
import { SectionDivider } from "./SectionDivider";

// ═══════════════════════════════════════════════════════════════
//   V3 — Oriental Atelier Homepage (complete)
//
//   敘事弧 (10 幕 + 終幕):
//     壹 · 品牌故事       察覺 → 相遇 → 選擇
//     肆 · 皮膚解剖       表皮 / 真皮 / 皮下屏障
//     伍 · 產品封瓶       USC-E / SiUPi POWDER (Living Vial)
//     陸 · 印章牆         INCI / TFDA / 中韓專利
//     柒 · 工坊           CEO Moli Chou + 團隊
//     捌 · 見證           Before / After 拖曳 + 數據
//     玖 · 耳語           用戶見證 crossfade
//     拾 · 邀請           我想預約
// ═══════════════════════════════════════════════════════════════

export default function V3Client() {
  return (
    <main className="relative">
      {/* Version badge */}
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

      {/* Divider · 壹 相遇 */}
      <SectionDivider variant="seal" sealChar="遇" whisper="the first chapter" chapter="壹 · 品牌故事" />

      {/* 2. BrandStory */}
      <BrandStoryV3 />

      {/* Divider · 知識 */}
      <SectionDivider variant="goldDrop" whisper="in the skin's quiet architecture" chapter="肆 · 皮膚解剖" />

      {/* 3. SkinLayers */}
      <SkinLayersV3 />

      {/* Divider · 科學 */}
      <SectionDivider variant="brush" whisper="bottled, measured, certified" chapter="伍 · 產品封瓶" tone="dark" />

      {/* 4. Product — Living Vial */}
      <ProductV3 />

      {/* Divider · 印章 */}
      <SectionDivider variant="seal" sealChar="證" whisper="stamped by institutions" chapter="陸 · 印章牆" />

      {/* 5. Certificate */}
      <CertificateV3 />

      {/* Divider · 人 */}
      <SectionDivider variant="goldDrop" whisper="the hands behind the formula" chapter="柒 · 工坊" />

      {/* 6. Founder */}
      <FounderV3 />

      {/* Divider · 見證 */}
      <SectionDivider variant="brush" whisper="proof, drawn on skin" chapter="捌 · 見證" tone="dark" />

      {/* 7. Before / After */}
      <BeforeAfterV3 />

      {/* Divider · 耳語 */}
      <SectionDivider variant="seal" sealChar="聆" whisper="voices from the journey" chapter="玖 · 耳語" />

      {/* 8. Testimonial */}
      <TestimonialV3 />

      {/* Divider · 邀請 */}
      <SectionDivider variant="goldDrop" whisper="and so, we invite you" chapter="拾 · 邀請" />

      {/* 9. Appointment */}
      <AppointmentV3 />

      {/* Footer 落款 */}
      <footer className="relative bg-ink paper-texture py-20 px-8">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-paper-cream/55">
          <div className="flex items-center gap-4">
            <div className="font-elegant italic text-xs tracking-[0.4em] uppercase">I · ME</div>
            <div className="w-px h-4 bg-leaf-gold/40" />
            <div className="font-sans-tc text-xs tracking-wider">Exosome Beauty · 外泌體美容</div>
          </div>
          <a
            href="/"
            className="font-elegant italic text-[0.68rem] tracking-[0.3em] uppercase text-paper-cream/30 hover:text-leaf-goldLight transition-colors duration-500 border-b border-transparent hover:border-leaf-gold/40 pb-1"
          >
            ← compare with v2
          </a>
          <div className="font-elegant italic text-[0.65rem] tracking-[0.3em] uppercase text-paper-cream/30">
            v3 · oriental atelier · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}
