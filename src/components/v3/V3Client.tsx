"use client";

import dynamic from "next/dynamic";
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

// Ambient wow layers — ssr:false because all observe window/canvas
const CursorV3 = dynamic(() => import("./CursorV3").then((m) => m.CursorV3), { ssr: false });
const ScrollGoldThread = dynamic(() => import("./ScrollGoldThread").then((m) => m.ScrollGoldThread), { ssr: false });
const AmbientGoldDust = dynamic(() => import("./AmbientGoldDust").then((m) => m.AmbientGoldDust), { ssr: false });
const V3FloatingCTA = dynamic(() => import("./V3FloatingCTA").then((m) => m.V3FloatingCTA), { ssr: false });

// ═══════════════════════════════════════════════════════════════
//   V3 — Oriental Atelier Homepage (COMPLETE + AMBIENT LAYER)
//   "Sulwhasoo 人蔘暖意 + Tatcha 宣紙寧靜 + Whoo 朱砂印 + 台灣藥鋪卷軸"
// ═══════════════════════════════════════════════════════════════

export default function V3Client() {
  return (
    <main className="relative">
      {/* ── Ambient wow layers(貫穿全站)── */}
      <CursorV3 />
      <ScrollGoldThread />
      <AmbientGoldDust count={28} />
      <V3FloatingCTA />

      {/* Version badge — hidden on mobile to avoid Header hamburger collision */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.8 }}
        className="hidden lg:block fixed top-24 right-6 z-50 px-4 py-2 bg-ink/85 backdrop-blur-sm text-paper-cream font-elegant italic text-xs tracking-[0.3em] border border-leaf-gold/30"
        style={{ borderRadius: "2px" }}
      >
        V3 · Oriental Atelier
      </motion.div>

      {/* 1. Hero */}
      <HeroV3 />

      <SectionDivider variant="seal" sealChar="遇" whisper="the first chapter" chapter="壹 · 品牌故事" />

      {/* 2. BrandStory */}
      <BrandStoryV3 />

      <SectionDivider variant="goldDrop" whisper="in the skin's quiet architecture" chapter="肆 · 皮膚解剖" />

      {/* 3. SkinLayers */}
      <SkinLayersV3 />

      <SectionDivider variant="brush" whisper="bottled, measured, certified" chapter="伍 · 產品封瓶" tone="dark" />

      {/* 4. Product — Living Vial */}
      <ProductV3 />

      <SectionDivider variant="seal" sealChar="證" whisper="stamped by institutions" chapter="陸 · 印章牆" />

      {/* 5. Certificate */}
      <CertificateV3 />

      <SectionDivider variant="goldDrop" whisper="the hands behind the formula" chapter="柒 · 工坊" />

      {/* 6. Founder */}
      <FounderV3 />

      <SectionDivider variant="brush" whisper="proof, drawn on skin" chapter="捌 · 見證" tone="dark" />

      {/* 7. Before / After */}
      <BeforeAfterV3 />

      <SectionDivider variant="seal" sealChar="聆" whisper="voices from the journey" chapter="玖 · 耳語" />

      {/* 8. Testimonial */}
      <TestimonialV3 />

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
