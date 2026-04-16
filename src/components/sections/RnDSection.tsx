"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "@/components/ui/TextReveal";

const cards = [
  {
    front: { icon: "🏥", title: "台中榮總專利技術轉移" },
    back: "神經外科楊孟寅醫師的臍帶間質幹細胞外泌體提取專利技術，經正式技術轉移授權，確保每一滴原液都有醫學中心級的基礎研究支撐。",
  },
  {
    front: { icon: "🔬", title: "雙和醫院第二期臨床試驗" },
    back: "與雙和醫院合作進行雷射術後皮膚修復的第二期臨床試驗，以實證醫學數據驗證外泌體在醫美修復領域的應用效果。",
  },
  {
    front: { icon: "⚙️", title: "全球獨家 3A-GTP 製程" },
    back: "結合 AI、AR、Auto 三大技術的全自動化細胞備製平台。產出細胞數達手工培養 10 倍，每億顆成本僅 1/10。",
  },
  {
    front: { icon: "💧", title: "修秘 USC 系列製劑級外泌體" },
    back: "每 1mL 安瓶含 2,000 億顆外泌體，平均粒徑 76.8-99.4nm，表達 CD9、CD63 外泌體特徵標誌物，結構與功能完整。",
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
        {/* 正面 */}
        <div className="absolute inset-0 rounded-xl border border-ivory/8 bg-night/80 backdrop-blur-sm
                       flex flex-col items-center justify-center gap-4 p-6
                       [backface-visibility:hidden]">
          <span className="text-4xl">{card.front.icon}</span>
          <h4 className="font-serif-tc text-lg text-ivory text-center font-medium leading-snug">
            {card.front.title}
          </h4>
          <div className="w-8 h-px bg-brand/30 mt-2" />
        </div>

        {/* 背面 */}
        <div className="absolute inset-0 rounded-xl border border-brand/20 bg-night/95 backdrop-blur-sm
                       flex flex-col items-center justify-center p-6
                       [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-sans-tc text-caption text-ivory/60 leading-[1.8] text-center">
            {card.back}
          </p>
          <a
            href="https://www.stellarcellbio.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-4 text-[0.65rem] text-brand-light hover:text-brand font-body tracking-wider
                       transition-colors duration-300 focus-visible:outline-none focus-visible:text-gold"
          >
            星誠細胞生醫官網 →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function RnDSection() {
  return (
    <section className="py-section-lg bg-night relative overflow-hidden noise-overlay">
      <div className="absolute top-0 right-[15%] w-px h-[25vh] bg-gradient-to-b from-brand/10 to-transparent" />
      <div className="absolute bottom-0 left-[20%] w-px h-[15vh] bg-gradient-to-t from-gold/8 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-brand-light uppercase tracking-[0.25em] font-body mb-4">
              R&D Partner
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-ivory">
              我們不說自己厲害，<br className="hidden md:block" />我們讓台中榮總說。
            </h2>
          </TextReveal>
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
