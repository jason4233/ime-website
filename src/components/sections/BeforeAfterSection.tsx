"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { ReactCompareSliderImage } from "react-compare-slider";
import { TextReveal } from "@/components/ui/TextReveal";
import { stripFocalPoint, urlToObjectPosition } from "@/lib/utils/focal-point";

// 動態載入避免 SSR 階段呼叫 CSS.registerProperty
const ReactCompareSlider = dynamic(
  () => import("react-compare-slider").then((m) => m.ReactCompareSlider),
  { ssr: false }
);

type CaseItem = {
  id: string | number;
  title: string;
  days: number;
  sessions: number;
  note: string;
  before: string;
  after: string;
};

// ─────────────────────────────────────────────────────────────────
// 法規合規重要說明:
// 本品為一般化粧品,依《化粧品衛生安全管理法》第 10 條,
// 廣告不得涉及醫療效能,亦不得有虛偽、誇大情事。
// 因此本區塊一律避免使用以下詞彙:
//   ✗ 雷射 / 術後 / 醫療 / 療程 / 修復(指真皮) / 治療
//   ✗ 改善膚色 / 淡化斑點 / 抗皺 / 抗老 / 除皺 / 緊實肌膚(深層)
//   ✗ 細紋改善 / 暗沉改善 / 鬆弛改善 / 美白 / 淡疤 / 再生
// 可用詞(食藥署 2023 版例示):
//   ✓ 保濕 / 滋潤 / 潤澤 / 柔嫩 / 平滑 / 緊緻(角質層)
//   ✓ 亮采 / 光澤 / 修護(角質層)
//   ✓ 保養紀錄 / 使用感受 / 肌膚柔嫩度 / 保水度 / 滋潤度
// ─────────────────────────────────────────────────────────────────

const fallbackCases: CaseItem[] = [
  {
    id: 1,
    title: "乾燥粗糙肌的保濕日記",
    days: 14,
    sessions: 14, // 用「次」中性表達使用頻率
    note: "每日早晚使用，14 天後肌膚保水度的個人感受紀錄",
    before: "https://placehold.co/500x600/2a1a1a/D4A89B?text=Before",
    after: "https://placehold.co/500x600/1a2a1a/B8953F?text=After",
  },
  {
    id: 2,
    title: "肌膚潤澤感體驗",
    days: 30,
    sessions: 30,
    note: "持續使用 5 週後，肌膚潤澤度與光澤感的個人保養紀錄",
    before: "https://placehold.co/500x600/2a1a1a/D4A89B?text=Before",
    after: "https://placehold.co/500x600/1a2a1a/B8953F?text=After",
  },
  {
    id: 3,
    title: "肌膚柔嫩度日記",
    days: 60,
    sessions: 60,
    note: "持續保養 60 天，肌膚柔嫩感與膚觸平滑度的個人紀錄",
    before: "https://placehold.co/500x600/2a1a1a/D4A89B?text=Before",
    after: "https://placehold.co/500x600/1a2a1a/B8953F?text=After",
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapDbCase(d: any): CaseItem {
  return {
    id: d.id,
    title: d.title ?? "案例",
    days: d.daysBetween ?? 0,
    sessions: 0, // DB 沒有 sessions 欄位，可由 notes 推斷或後續加入
    note: d.notes ?? "",
    before: d.beforeImageUrl || fallbackCases[0].before,
    after: d.afterImageUrl || fallbackCases[0].after,
  };
}

function CaseCard({ caseItem, index }: { caseItem: CaseItem; index: number }) {
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
              src={stripFocalPoint(caseItem.before)}
              alt={`${caseItem.title} Before`}
              style={{ objectPosition: urlToObjectPosition(caseItem.before) }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={stripFocalPoint(caseItem.after)}
              alt={`${caseItem.title} After`}
              style={{ objectPosition: urlToObjectPosition(caseItem.after) }}
            />
          }
        />
      </div>

      {/* 資訊 */}
      <div className="p-5">
        <h4 className="font-serif-tc text-lg text-ivory font-medium mb-2">
          {caseItem.title}
        </h4>
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="px-2 py-0.5 text-[0.6rem] font-body rounded-full bg-gold/10 text-gold">
            持續 {caseItem.days} 天
          </span>
          <span className="px-2 py-0.5 text-[0.6rem] font-body rounded-full bg-brand/10 text-brand-light">
            日常居家使用
          </span>
        </div>
        {caseItem.note && (
          <p className="font-sans-tc text-caption text-ivory/35 leading-relaxed">
            {caseItem.note}
          </p>
        )}
        <p className="mt-3 pt-3 border-t border-ivory/5 text-[0.6rem] text-ivory/25 font-body leading-relaxed">
          ※ 個人保養感受紀錄,結果因人而異
        </p>
      </div>
    </motion.div>
  );
}

export function BeforeAfterSection({ data }: { data?: any[] } = {}) {
  const cases: CaseItem[] =
    data && data.length > 0 ? data.map(mapDbCase) : fallbackCases;
  return (
    <section className="py-section-lg bg-[#0C0C0C] relative overflow-hidden noise-overlay">
      <div className="absolute top-0 right-[15%] w-px h-[20vh] bg-gradient-to-b from-gold/8 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-gold/50 uppercase tracking-[0.25em] font-body mb-4">
              Skin Diary · 肌膚保養紀錄
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-ivory">
              不用說太多，拖拉看看
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="font-sans-tc text-body text-ivory/30 mt-3 max-w-xl mx-auto">
              左右拖動滑桿，看見每位使用者的個別保養紀錄。
            </p>
          </TextReveal>
          <TextReveal delay={0.3}>
            <p className="mt-4 max-w-xl mx-auto text-[0.7rem] text-ivory/25 font-body leading-relaxed">
              以下為使用者個人保養紀錄分享。本品為一般化粧品，不具醫療效能。
            </p>
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <CaseCard key={c.id} caseItem={c} index={i} />
          ))}
        </div>

        {/* 法定聲明 — 必須清楚可讀,不可隱藏 */}
        <div className="mt-12 max-w-3xl mx-auto px-4 py-4 rounded-md border border-ivory/5 bg-night/40">
          <p className="text-[0.65rem] text-ivory/35 font-body leading-relaxed text-center">
            <span className="text-ivory/50">法定聲明 ｜ </span>
            本網頁所示產品已依《化粧品衛生安全管理法》登錄，屬一般化粧品，非醫療器材或藥品，無治療或預防疾病之功能。
            圖像所呈現之膚況變化為使用者個別保養感受紀錄，並非每一位使用者皆能達到相同結果。
            如有皮膚相關困擾，建議諮詢專業皮膚科醫師。
          </p>
        </div>
      </div>
    </section>
  );
}
