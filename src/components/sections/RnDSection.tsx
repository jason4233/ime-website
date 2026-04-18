"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "@/components/ui/TextReveal";

const cards = [
  {
    front: { image: "/images/660147_0.jpg", title: "台中榮總專利技術轉移", subtitle: "Patent transferred from Taichung Veterans Hospital" },
    back: "神經外科楊孟寅醫師的臍帶間質幹細胞外泌體提取專利技術，經正式技術轉移授權，確保每一滴原液都有醫學中心級的基礎研究支撐。",
    link: { href: "https://www.vghtc.gov.tw/", label: "台中榮總 →" },
  },
  {
    front: { image: "/images/660148_0.jpg", title: "醫療機構合作研究", subtitle: "Clinical partnership with top-tier hospitals" },
    back: "與星和診所 AI 肌膚檢測合作臨床驗證：泛紅舒緩、光澤提升、膚色均勻度「明顯優於對照組」。所有研究僅供原料技術說明。",
    link: { href: "https://www.biotech-edu.com/stellarcellbio-smedtrum-starclinic-cooperation/", label: "臨床合作報導 →" },
  },
  {
    front: { image: "/images/660149_0.jpg", title: "全球獨家 3A-GTP 製程", subtitle: "AI + AR + Auto full-automated CDMO" },
    back: "博訊生技 3A-GTP 技術：AI + AR + 全自動化細胞備製平台。產線人力僅業界 1/10、產能多 10 倍，每億顆細胞成本僅 1/10。已反向輸出日本。",
    link: { href: "https://www.drsignal.com.tw/", label: "博訊生技官網 →" },
  },
  {
    front: { image: "/images/42706_0.jpg", title: "修秘 USC 系列製劑級外泌體", subtitle: "2,000 億顆 · 76.8–99.4 nm · CD9/CD63" },
    back: "每 1mL 安瓶含 2,000 億顆外泌體，平均粒徑 76.8-99.4nm，表達 CD9、CD63 外泌體特徵標誌物，結構與功能完整。由 TFDA 核准的醫療級全自動化設備生產。",
    link: { href: "https://www.stellarcellbio.com/", label: "星誠細胞生醫 →" },
  },
];

function FlipCard({ card, index }: { card: typeof cards[0]; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="perspective-1000 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`relative w-full aspect-[4/3] transition-transform duration-700 ease-spring
          ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 正面 — 全版實拍背景 + 漸層蓋 + 文字 */}
        <div className="absolute inset-0 rounded-xl overflow-hidden border border-night/10 shadow-elevated
                       [backface-visibility:hidden]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.front.image}
            alt={card.front.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 品牌色調層（mix-blend 增加統一感） */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/25 via-transparent to-gold/15 mix-blend-multiply" />
          {/* 底部深色漸層（確保文字可讀） */}
          <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/30 to-transparent" />

          {/* 文字內容 */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <p className="text-[0.6rem] uppercase tracking-[0.25em] font-body text-gold/80 mb-2">
              {card.front.subtitle}
            </p>
            <h4 className="font-serif-tc text-lg md:text-xl text-ivory font-medium leading-snug">
              {card.front.title}
            </h4>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-8 h-px bg-gold/60" />
              <span className="text-[0.6rem] text-ivory/60 font-body tracking-wider">HOVER</span>
            </div>
          </div>
        </div>

        {/* 背面 — 詳細文字 */}
        <div className="absolute inset-0 rounded-xl border border-brand/30 overflow-hidden shadow-elevated
                       [backface-visibility:hidden] [transform:rotateY(180deg)]"
             style={{
               background: "linear-gradient(135deg, #1A0F24 0%, #2A1840 60%, #1A0F24 100%)",
             }}>
          {/* 裝飾紋理 */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-gold/10 blur-2xl" />

          <div className="relative z-10 h-full flex flex-col justify-center items-center p-6">
            <p className="font-sans-tc text-caption text-ivory/75 leading-[1.85] text-center">
              {card.back}
            </p>
            <a
              href={card.link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-5 text-[0.7rem] text-gold hover:text-gold-light font-body tracking-wider
                         transition-colors duration-300 focus-visible:outline-none focus-visible:text-gold-light"
            >
              {card.link.label}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function RnDSection() {
  return (
    <section
      className="py-section-lg relative overflow-hidden noise-overlay"
      style={{
        background: `
          radial-gradient(ellipse 100% 70% at 50% 0%, #F2E9D5 0%, #F5EBE5 50%, #EFE0D2 100%)
        `,
      }}
    >
      <div className="absolute top-0 right-[15%] w-px h-[25vh] bg-gradient-to-b from-brand/20 to-transparent" />
      <div className="absolute bottom-0 left-[20%] w-px h-[15vh] bg-gradient-to-t from-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-brand uppercase tracking-[0.28em] font-body font-semibold mb-4">
              R&amp;D Partner
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-night">
              我們不說自己厲害，<br className="hidden md:block" />我們讓台中榮總說。
            </h2>
          </TextReveal>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <FlipCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
