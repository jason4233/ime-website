"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";

const newsItems = [
  {
    id: 1, media: "經濟日報",
    title: "搶攻再生醫療與智慧醫美雙軌策略！星誠修秘搭載自動化製程擴大臨床應用",
    date: "2025/07/28",
    url: "https://money.udn.com/money/story/5724/8897024",
    ogImage: "https://pgw.udn.com.tw/gw/photo.php?u=https://uc.udn.com.tw/photo/2025/07/25/2/32714081.jpg&x=0&y=0&sw=0&sh=0&sl=W&fw=1050&exp=3600",
  },
  {
    id: 2, media: "立報傳媒",
    title: "星誠細胞生醫宣布第二期募資超過一億元！以雙軌策略引領全球",
    date: "2024/12/03",
    url: "https://www.limedia.tw/tech/55859/",
    ogImage: "https://www.limedia.tw/wp-content/uploads/2024/12/202412035.jpg",
  },
  {
    id: 3, media: "Taiwan News",
    title: "2024 台灣醫療科技展焦點：星誠細胞推用吸的外泌體 可直達真皮層肌底",
    date: "2024/12/06",
    url: "https://www.taiwannews.com.tw/zh/news/5986204",
    ogImage: "https://image.taiwannews.com.tw/2024%2F12%2F06%2F27319c4b7347458b9d14f1d67f33d8c2.jpg",
  },
  {
    id: 4, media: "台灣光鹽生技",
    title: "台灣生技醫療產業鏈三箭齊發！星誠細胞生醫、巨興醫學、星和診所攜手臨床驗證",
    date: "2025/05/22",
    url: "https://www.biotech-edu.com/stellarcellbio-smedtrum-starclinic-cooperation/",
    ogImage: "https://www.biotech-edu.com/wp-content/uploads/2025/05/stellarcellbio-Smedtrum-starclinic.webp",
  },
  {
    id: 5, media: "星誠預防醫學",
    title: "從製程到應用：星誠細胞生醫打造全亞洲最穩定的外泌體量產系統",
    date: "2025/07/01",
    url: "https://prevent.starnic.com.tw/zh/article/364",
    ogImage: "https://prevent.starnic.com.tw/image/og-image.png",
  },
  {
    id: 6, media: "國家生技研究園區",
    title: "博訊生物科技 進駐國家級生技園區",
    date: "2024/01/01",
    url: "https://nbrp.sinica.edu.tw/pages/62/companies/86",
    ogImage: "https://nbrp.sinica.edu.tw/uploads/home_editor/banner/1/banner1.jpg",
  },
  {
    id: 7, media: "Healthcare+ B2B",
    title: "星誠細胞生醫 全台最大細胞臨床數據智財庫",
    date: "2024/12/01",
    url: "https://www.taiwan-healthcare.org/zh/company-detail?id=0shgs43gv7x7exjr",
    ogImage: "https://www.taiwan-healthcare.org/data/cht/20240731/20240731he84tk.png",
  },
  {
    id: 8, media: "環球生技月刊",
    title: "博訊自動化數位GTP細胞製程 獲電子業老將力挺、持股15%",
    date: "2024/08/15",
    url: "https://news.gbimonthly.com/tw/article/show.php?num=54898",
    ogImage: "https://news.gbimonthly.com/upload/article/2022/12/1201%E5%8D%9A%E8%A8%8A-1280x720%E7%AF%84%E6%9C%AC-ST.jpg",
  },
  {
    id: 9, media: "經濟日報",
    title: "星誠細胞生醫宣布第二期募資超過一億元",
    date: "2024/12/03",
    url: "https://money.udn.com/money/story/5635/8400920",
    ogImage: "",
  },
  {
    id: 10, media: "鏡週刊",
    title: "神祕半導體大咖卡位細胞治療 博訊生技挑戰CDMO霸主",
    date: "2024/12/05",
    url: "https://www.mirrormedia.mg/story/20221202fin006",
    ogImage: "https://v3-statics.mirrormedia.mg/images/20221202144907-7785d8b701a4f0cc19b4b9010e81312f-w1600.jpg",
  },
];

// 媒體品牌色（fallback 用 — og:image 抓不到時顯示）
const mediaColors: Record<string, { bg: string; accent: string }> = {
  "經濟日報": { bg: "linear-gradient(135deg, #C62828, #8B0000)", accent: "#FFD54F" },
  "Taiwan News": { bg: "linear-gradient(135deg, #1565C0, #0D47A1)", accent: "#64B5F6" },
  "台灣光鹽生技": { bg: "linear-gradient(135deg, #00695C, #004D40)", accent: "#80CBC4" },
  "星誠預防醫學": { bg: "linear-gradient(135deg, #7B2FBE, #5E1F96)", accent: "#D4B96A" },
  "國家生技研究園區": { bg: "linear-gradient(135deg, #1A237E, #0D1438)", accent: "#FFD54F" },
  "Healthcare+ B2B": { bg: "linear-gradient(135deg, #004D40, #00251A)", accent: "#4DB6AC" },
  "環球生技月刊": { bg: "linear-gradient(135deg, #3E2723, #1B0000)", accent: "#D4B96A" },
  "立報傳媒": { bg: "linear-gradient(135deg, #B71C1C, #7F0000)", accent: "#FFD54F" },
  "鏡週刊": { bg: "linear-gradient(135deg, #212121, #000000)", accent: "#FFD700" },
};

const getMediaStyle = (media: string) =>
  mediaColors[media] ?? { bg: "linear-gradient(135deg, #3A2A4E, #1F152A)", accent: "#D4B96A" };

/** 新聞卡圖片 — 硬編 og:image 為主，失敗/為空則顯示媒體品牌 fallback */
function NewsImage({ ogImage, media, title }: { ogImage: string; media: string; title: string }) {
  const [failed, setFailed] = useState(!ogImage);
  const style = getMediaStyle(media);

  if (failed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center relative overflow-hidden"
        style={{ background: style.bg }}
      >
        {/* 紋理層 */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.35), transparent 50%)",
          }}
        />
        <div className="relative text-center px-4">
          <p
            className="font-serif-tc text-2xl md:text-3xl text-white/95 font-semibold tracking-wide mb-1"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            {media}
          </p>
          <div className="w-10 h-px mx-auto my-2" style={{ background: style.accent }} />
          <p className="text-[0.55rem] tracking-[0.3em] uppercase" style={{ color: style.accent }}>
            Media Coverage
          </p>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ogImage}
      alt={title}
      onError={() => setFailed(true)}
      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      loading="lazy"
    />
  );
}

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
            className="shrink-0 w-[320px] rounded-lg overflow-hidden border border-ivory/8
                       hover:border-brand/40 transition-all duration-300 group
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40
                       shadow-elevated"
          >
            {/* 媒體 og:image（或品牌 fallback） */}
            <div className="relative h-[120px] overflow-hidden bg-night/40 group">
              <NewsImage ogImage={item.ogImage} media={item.media} title={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-transparent pointer-events-none" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-night/70 backdrop-blur-sm">
                <span className="text-[0.55rem] text-gold font-body tracking-wider">{item.media}</span>
              </div>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-night/60 text-[0.55rem] text-ivory/75 font-body">{item.date}</span>
            </div>
            {/* 標題 */}
            <div className="p-3.5 bg-night/60 backdrop-blur-sm">
              <p className="font-sans-tc text-caption text-ivory/80 leading-snug line-clamp-2
                           group-hover:text-ivory transition-colors duration-300">
                {item.title}
              </p>
            </div>
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
        className="relative w-[320px] h-[280px] mx-auto cursor-pointer"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {topCards.map((item, i) => {
          const baseRotate = (i - 2) * 3;
          const baseY = i * -4;
          // hover 時大幅扇形展開：水平拉開 320px / 卡片，旋轉 ±15度
          const spreadRotate = hovered ? (i - 2) * 15 : baseRotate;
          const spreadX = hovered ? (i - 2) * 320 : 0;
          const spreadY = hovered ? Math.abs(i - 2) * 25 + baseY : baseY;

          return (
            <motion.div
              key={item.id}
              className="absolute inset-0 rounded-xl overflow-hidden border border-ivory/10
                         shadow-floating cursor-pointer
                         hover:border-brand/50 transition-colors duration-200"
              style={{ zIndex: 5 - i }}
              animate={{
                rotate: spreadRotate,
                x: spreadX,
                y: spreadY,
                scale: hovered ? 1 : 1 - i * 0.02,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: hovered ? Math.abs(i - 2) * 0.04 : 0 }}
              onClick={() => setDrawerItem(item)}
            >
              {/* 媒體 og:image（或品牌 fallback） */}
              <div className="absolute inset-0">
                <NewsImage ogImage={item.ogImage} media={item.media} title={item.title} />
              </div>
              {/* 品牌色調 overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand/25 via-night/30 to-gold/10 mix-blend-multiply pointer-events-none" />
              {/* 底部深色漸層 */}
              <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/55 to-night/10 pointer-events-none" />

              <div className="relative z-10 h-full flex flex-col justify-between p-5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-[0.55rem] text-gold font-bold">{item.media[0]}</span>
                  </div>
                  <span className="text-[0.7rem] text-ivory/85 font-body font-medium">{item.media}</span>
                </div>
                <div>
                  <h4 className="font-serif-tc text-sm md:text-base text-ivory leading-snug line-clamp-3 mb-2 font-medium"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                    {item.title}
                  </h4>
                  <p className="text-[0.6rem] text-gold/80 font-body tracking-wider">{item.date}</p>
                </div>
              </div>
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
    <section
      className="py-section-lg relative overflow-hidden noise-overlay"
      style={{
        background: `
          radial-gradient(ellipse 90% 60% at 50% 20%, #3A2A4E 0%, #2A1F3A 60%, #1F152A 100%)
        `,
      }}
    >
      {/* 柔霧光斑 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 500px at 15% 30%, rgba(123, 47, 190, 0.18) 0%, transparent 60%),
            radial-gradient(circle 400px at 85% 70%, rgba(184, 149, 63, 0.15) 0%, transparent 60%)
          `,
        }}
      />
      <div className="absolute top-0 right-[18%] w-px h-[25vh] bg-gradient-to-b from-brand/30 to-transparent" />

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

      {/* 疊高卡片（hover 大幅扇形展開，需要足夠高度/寬度） */}
      <div className="mb-16 overflow-visible py-12 px-6">
        <StackedCards items={newsItems} />
        <p className="text-center text-[0.65rem] text-ivory/15 font-body mt-8">
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
