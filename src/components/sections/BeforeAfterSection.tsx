"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { ReactCompareSliderImage } from "react-compare-slider";
import { TextReveal } from "@/components/ui/TextReveal";

// 動態載入避免 SSR 階段呼叫 CSS.registerProperty
const ReactCompareSlider = dynamic(
  () => import("react-compare-slider").then((m) => m.ReactCompareSlider),
  { ssr: false }
);

const cases = [
  {
    id: 1,
    title: "雷射術後修復",
    days: 14,
    sessions: 3,
    note: "皮秒雷射後搭配外泌體導入，泛紅明顯舒緩（個人體驗，效果因人而異）",
    before: "https://placehold.co/500x600/2a1a1a/D4A89B?text=Before",
    after: "https://placehold.co/500x600/1a2a1a/B8953F?text=After",
  },
  {
    id: 2,
    title: "暗沉膚色改善",
    days: 30,
    sessions: 5,
    note: "持續五次泌容術療程，肌膚光澤度有感提升（個人體驗，效果因人而異）",
    before: "https://placehold.co/500x600/2a1a1a/D4A89B?text=Before",
    after: "https://placehold.co/500x600/1a2a1a/B8953F?text=After",
  },
  {
    id: 3,
    title: "細紋與鬆弛改善",
    days: 60,
    sessions: 8,
    note: "持續保養兩個月，膚觸更加細緻平滑（個人體驗，效果因人而異）",
    before: "https://placehold.co/500x600/2a1a1a/D4A89B?text=Before",
    after: "https://placehold.co/500x600/1a2a1a/B8953F?text=After",
  },
];

function CaseCard({ caseItem, index }: { caseItem: typeof cases[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl overflow-hidden border border-ivory/8 bg-night/50"
    >
      {/* 對比滑桿 */}
      <div className="aspect-[5/6]">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={caseItem.before}
              alt={`${caseItem.title} Before`}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={caseItem.after}
              alt={`${caseItem.title} After`}
            />
          }
        />
      </div>

      {/* 資訊 */}
      <div className="p-5">
        <h4 className="font-serif-tc text-lg text-ivory font-medium mb-2">
          {caseItem.title}
        </h4>
        <div className="flex gap-2 mb-3">
          <span className="px-2 py-0.5 text-[0.6rem] font-body rounded-full bg-gold/10 text-gold">
            相隔 {caseItem.days} 天
          </span>
          <span className="px-2 py-0.5 text-[0.6rem] font-body rounded-full bg-brand/10 text-brand-light">
            {caseItem.sessions} 次療程
          </span>
        </div>
        {caseItem.note && (
          <p className="font-sans-tc text-caption text-ivory/35 leading-relaxed">
            {caseItem.note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function BeforeAfterSection() {
  return (
    <section className="py-section-lg bg-[#0C0C0C] relative overflow-hidden noise-overlay">
      <div className="absolute top-0 right-[15%] w-px h-[20vh] bg-gradient-to-b from-gold/8 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-gold/50 uppercase tracking-[0.25em] font-body mb-4">
              Before & After
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-ivory">
              不用說太多，拖拉看看
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="font-sans-tc text-body text-ivory/30 mt-3 max-w-md mx-auto">
              左右拖動滑桿，看見真實改變。圖片上線前將替換為實際案例。
            </p>
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <CaseCard key={c.id} caseItem={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
