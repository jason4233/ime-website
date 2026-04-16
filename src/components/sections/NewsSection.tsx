"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";

const newsItems = [
  { id: 1, media: "經濟日報", title: "搶攻再生醫療與智慧醫美雙軌策略！星誠修秘搭載自動化製程擴大臨床應用", date: "2025/07/28", url: "https://money.udn.com/money/story/5724/8897024" },
  { id: 2, media: "經濟日報", title: "星誠細胞生醫宣布第二期募資超過一億元", date: "2024/12/03", url: "https://money.udn.com/money/story/5635/8400920" },
  { id: 3, media: "Taiwan News", title: "2024 台灣醫療科技展焦點：星誠細胞推用吸的外泌體 可直達真皮層肌底", date: "2024/12/06", url: "https://www.taiwannews.com.tw/zh/news/5986204" },
  { id: 4, media: "台灣光鹽生技", title: "台灣生技醫療產業鏈三箭齊發！星誠細胞生醫、巨興醫學、星和診所攜手臨床驗證", date: "2025/05/22", url: "https://www.biotech-edu.com/stellarcellbio-smedtrum-starclinic-cooperation/" },
  { id: 5, media: "星誠預防醫學", title: "從製程到應用：星誠細胞生醫打造全亞洲最穩定的外泌體量產系統", date: "2025/07/01", url: "https://prevent.starnic.com.tw/zh/article/364" },
  { id: 6, media: "國家生技研究園區", title: "博訊生物科技 進駐國家級生技園區", date: "2024/01/01", url: "https://nbrp.sinica.edu.tw/pages/62/companies/86" },
  { id: 7, media: "Healthcare+ B2B", title: "星誠細胞生醫 全台最大細胞臨床數據智財庫", date: "2024/12/01", url: "https://www.taiwan-healthcare.org/zh/company-detail?id=0shgs43gv7x7exjr" },
  { id: 8, media: "環球生技月刊", title: "博訊自動化數位GTP細胞製程 獲電子業老將力挺、持股15%", date: "2024/08/15", url: "https://news.gbimonthly.com/tw/article/show.php?num=54898" },
  { id: 9, media: "立報傳媒", title: "星誠細胞生醫宣布第二期募資超過一億元！以雙軌策略與創新技術引領全球", date: "2024/12/03", url: "https://www.limedia.tw/tech/55859/" },
  { id: 10, media: "鏡週刊", title: "神祕半導體大咖卡位細胞治療 博訊生技挑戰CDMO霸主", date: "2024/12/05", url: "https://www.mirrormedia.mg/story/20221202fin006" },
];

// Marquee 一行
function Marquee({ items, direction = "left", speed = 30 }: {
  items: typeof newsItems;
  direction?: "left" | "right";
  speed?: number;
}) {
  const animDir = direction === "left" ? "-50%" : "0%";
  const animFrom = direction === "left" ? "0%" : "-50%";

  return (
    <div className="overflow-hidden py-2">
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: [animFrom, animDir] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <a
            key={`${item.id}-${i}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-[300px] p-4 rounded-lg border border-ivory/5 bg-ivory/[0.02]
                       hover:border-brand/20 hover:bg-brand/5
                       transition-all duration-300 group
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <span className="text-[0.5rem] text-brand font-bold">{item.media[0]}</span>
              </div>
              <span className="text-[0.65rem] text-ivory/30 font-body truncate">{item.media}</span>
              <span className="text-[0.55rem] text-ivory/15 font-body ml-auto shrink-0">{item.date}</span>
            </div>
            <p className="font-sans-tc text-caption text-ivory/60 leading-snug line-clamp-2
                         group-hover:text-ivory/80 transition-colors duration-300">
              {item.title}
            </p>
          </a>
        ))}
      </motion.div>
    </div>
  );
}

// 疊高的新聞卡片
function StackedCards({ items }: { items: typeof newsItems }) {
  const [hovered, setHovered] = useState(false);
  const [drawerItem, setDrawerItem] = useState<typeof newsItems[0] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const topCards = items.slice(0, 5);

  return (
    <>
      <motion.div
        ref={ref}
        className="relative w-[320px] h-[240px] mx-auto cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {topCards.map((item, i) => {
          const baseRotate = (i - 2) * 3;
          const baseY = i * -4;
          const spreadRotate = hovered ? (i - 2) * 8 : baseRotate;
          const spreadX = hovered ? (i - 2) * 30 : 0;
          const spreadY = hovered ? Math.abs(i - 2) * -15 + baseY : baseY;

          return (
            <motion.div
              key={item.id}
              className="absolute inset-0 rounded-xl border border-ivory/8 bg-night/90 backdrop-blur-sm
                         p-5 shadow-floating cursor-pointer
                         hover:border-brand/30 transition-colors duration-200"
              style={{ zIndex: 5 - i }}
              animate={{
                rotate: spreadRotate,
                x: spreadX,
                y: spreadY,
                scale: 1 - i * 0.02,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setDrawerItem(item)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-brand/15 flex items-center justify-center">
                  <span className="text-[0.55rem] text-brand font-bold">{item.media[0]}</span>
                </div>
                <span className="text-[0.7rem] text-ivory/40 font-body">{item.media}</span>
              </div>
              <h4 className="font-serif-tc text-sm text-ivory/80 leading-snug line-clamp-3">
                {item.title}
              </h4>
              <p className="text-[0.6rem] text-ivory/20 font-body mt-3">{item.date}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-end"
            onClick={() => setDrawerItem(null)}
          >
            <div className="absolute inset-0 bg-night/60 backdrop-blur-sm" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md h-full bg-[#111] border-l border-ivory/5 p-8
                         flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setDrawerItem(null)}
                className="self-end mb-8 text-ivory/30 hover:text-ivory transition-colors
                           focus-visible:outline-none focus-visible:text-gold"
              >
                ✕ 關閉
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center">
                  <span className="text-sm text-brand font-bold">{drawerItem.media[0]}</span>
                </div>
                <div>
                  <p className="font-body text-sm text-ivory/60">{drawerItem.media}</p>
                  <p className="font-body text-[0.65rem] text-ivory/25">{drawerItem.date}</p>
                </div>
              </div>
              <h3 className="font-serif-tc text-xl text-ivory leading-relaxed mb-6">
                {drawerItem.title}
              </h3>
              <div className="w-12 h-px bg-brand/30 mb-6" />
              <p className="font-sans-tc text-body text-ivory/40 leading-[1.8] mb-8">
                點擊下方連結閱讀完整報導原文。
              </p>
              <a
                href={drawerItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-center"
              >
                閱讀原文報導 →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function NewsSection() {
  const firstHalf = newsItems.slice(0, 5);
  const secondHalf = newsItems.slice(5);

  return (
    <section className="py-section-lg bg-night relative overflow-hidden noise-overlay">
      <div className="absolute top-0 right-[18%] w-px h-[25vh] bg-gradient-to-b from-brand/10 to-transparent" />

      {/* 標題 */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 mb-12">
        <div className="text-center">
          <TextReveal>
            <p className="text-overline text-brand-light uppercase tracking-[0.25em] font-body mb-4">
              Media Coverage
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-ivory mb-4">
              不是我們說自己值得信任，<br className="hidden md:block" />
              是這些媒體說的。
            </h2>
          </TextReveal>
        </div>
      </div>

      {/* 疊高卡片 */}
      <div className="mb-16">
        <StackedCards items={newsItems} />
        <p className="text-center text-[0.65rem] text-ivory/15 font-body mt-6">
          hover 散開 · 點擊任一張查看報導
        </p>
      </div>

      {/* Marquee 跑馬燈 — 兩行反向 */}
      <div className="space-y-2">
        <Marquee items={firstHalf} direction="left" speed={35} />
        <Marquee items={secondHalf} direction="right" speed={40} />
      </div>

      {/* 統計 */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-16">
        <TextReveal>
          <div className="flex items-center justify-center gap-12 md:gap-20">
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl text-gold font-bold">10+</p>
              <p className="font-sans-tc text-caption text-ivory/25 mt-1">則媒體報導</p>
            </div>
            <div className="w-px h-10 bg-ivory/8" />
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl text-brand-light font-bold">1.2</p>
              <p className="font-sans-tc text-caption text-ivory/25 mt-1">億元募資</p>
            </div>
            <div className="w-px h-10 bg-ivory/8" />
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl text-gold font-bold">6</p>
              <p className="font-sans-tc text-caption text-ivory/25 mt-1">項國際專利</p>
            </div>
          </div>
        </TextReveal>
      </div>
    </section>
  );
}
