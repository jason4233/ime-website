"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//   BrandStoryV3 — 書冊三幕
//   • 宣紙底 + 紙紋肌理
//   • 每幕對應不同暖色(米/粉玫/焦糖)
//   • 標題: Serif 中文 + 義大利英文副標並排
//   • 裝飾: 金線框 + 朱砂章印頁角
//   • 過場: Cross-fade 背景 + stagger 文字
// ═══════════════════════════════════════════════════════════════

type Act = {
  id: number;
  chapter: string;      // 章節編號（中文）
  whisper: string;      // 英文詩句
  title: string;        // 中文主標（可用 \n 換行）
  body: string;         // 內文
  bgClass: string;      // 背景色 class
  accentClass: string;  // 主色 class
  sealChar: string;     // 頁角印章字
};

const acts: Act[] = [
  {
    id: 0,
    chapter: "壹 · 察覺",
    whisper: "when did I stop looking at myself?",
    title: "所有的「還可以」,\n都是對自己的一種將就。",
    body: `妥協那張被拍得不好看的照片,
妥協鏡子裡越來越陌生的自己,
妥協「沒辦法,年紀到了」這六個字。`,
    bgClass: "bg-paper-warm",
    accentClass: "text-ink",
    sealChar: "察",
  },
  {
    id: 1,
    chapter: "貳 · 相遇",
    whisper: "a letter between cells, quietly delivered",
    title: "直到妳知道,\n細胞之間有郵差。",
    body: `外泌體——細胞與細胞之間的訊息郵差。
它把「修護」這個訊息,送到該去的地方。
而臍帶間質幹細胞分泌的外泌體,是郵差裡最溫柔的那一種。`,
    bgClass: "bg-paper-cream",
    accentClass: "text-aubergine",
    sealChar: "遇",
  },
  {
    id: 2,
    chapter: "參 · 選擇",
    whisper: "a soft choice, to return to yourself",
    title: "i me,\n是妳對自己的一次重新選擇。",
    body: `我們不想說服妳變美,
我們想讓妳想起——
妳本來就值得每天早上醒來,看鏡子時微微笑一下。`,
    bgClass: "bg-paper-rice",
    accentClass: "text-vermillion",
    sealChar: "選",
  },
];

export function BrandStoryV3() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeAct, setActiveAct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const raw = Math.max(0, Math.min(1, -rect.top / total));
      if (raw < 0.33) setActiveAct(0);
      else if (raw < 0.66) setActiveAct(1);
      else setActiveAct(2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const act = acts[activeAct];

  return (
    <div ref={outerRef} style={{ height: "320vh" }} className="relative">
      <section className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 背景 cross-fade */}
        {acts.map((a) => (
          <motion.div
            key={a.id}
            className={`absolute inset-0 ${a.bgClass} paper-texture`}
            initial={false}
            animate={{ opacity: activeAct === a.id ? 1 : 0 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}

        {/* 頁角印章（hover 會偏移；手機縮小移位避免壓到文字） */}
        <div className="absolute top-6 right-6 md:top-14 md:right-14 z-[15] pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`seal-${activeAct}`}
              initial={{ opacity: 0, scale: 1.4, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.9, ease: [0.3, 1.4, 0.5, 1] }}
              className="relative w-[52px] h-[52px] md:w-[72px] md:h-[72px] flex items-center justify-center bg-vermillion"
              style={{
                backgroundImage: `
                  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><filter id='k'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.64  0 0 0 0 0.17  0 0 0 0 0.18  0 0 0 0.45 0'/></filter><rect width='100%25' height='100%25' filter='url(%23k)'/></svg>")`,
                backgroundBlendMode: "overlay",
                borderRadius: "3px",
                boxShadow: "0 3px 12px rgba(164,44,46,0.35)",
              }}
            >
              <span
                className="font-serif-tc text-paper-cream font-bold text-[22px] md:text-[32px]"
                style={{ letterSpacing: "0.02em" }}
              >
                {act.sealChar}
              </span>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 0 2px rgba(164,44,46,0.55), inset 0 0 10px rgba(0,0,0,0.22)",
                  borderRadius: "3px",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 金色裝飾邊框 — 頂底金線 */}
        <motion.div
          key={`frame-top-${activeAct}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 left-[10%] right-[10%] h-px bg-leaf-gold/40 origin-left z-[12]"
        />
        <motion.div
          key={`frame-bot-${activeAct}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-10 left-[10%] right-[10%] h-px bg-leaf-gold/40 origin-right z-[12]"
        />

        {/* 章節進度指示（左側數字豎排；手機縮到角落） */}
        <div className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4 md:gap-6">
          {acts.map((a, i) => (
            <div key={a.id} className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  height: activeAct === i ? 36 : 8,
                  backgroundColor: activeAct === i ? "#A42C2E" : "rgba(26, 22, 17, 0.18)",
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-[2px] rounded-full"
              />
              <span
                className={`font-serif-tc text-[0.7rem] tracking-widest transition-colors duration-500 ${
                  activeAct === i ? "text-vermillion" : "text-ink/25"
                }`}
              >
                {["壹", "貳", "參"][i]}
              </span>
            </div>
          ))}
        </div>

        {/* 主內容 */}
        <div className="relative z-20 h-full flex items-center justify-center px-8">
          <div className="max-w-3xl w-full">
            <AnimatePresence mode="wait">
              <motion.article
                key={`text-${activeAct}`}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Editorial 章節:巨型 Roman numeral(Bodoni Moda italic)+ 中文章名 */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 }}
                  className="flex items-end gap-5 mb-8"
                >
                  {/* Roman numeral 做為 editorial 章節大數 */}
                  <span
                    className="font-statement italic text-vermillion/25 leading-none select-none"
                    style={{ fontSize: "clamp(4rem, 8vw, 7rem)", letterSpacing: "-0.04em" }}
                    aria-hidden
                  >
                    {["I", "II", "III"][activeAct]}
                  </span>
                  <span className="font-serif-tc text-vermillion/85 text-sm tracking-[0.55em] pb-3">
                    {act.chapter}
                  </span>
                </motion.div>

                {/* Pull-quote whisper — editorial grid 手法:超大裝飾引號 + italic 拉到頁邊 */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 }}
                  className="relative mb-12 pl-8 md:pl-12 border-l-2 border-leaf-gold/40"
                >
                  <span
                    className="font-statement italic text-vermillion/35 absolute -left-1 md:-left-2 -top-2 leading-none select-none"
                    style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <p
                    className="font-elegant italic text-ink/65 text-[clamp(1.05rem,1.6vw,1.35rem)] tracking-wide leading-relaxed"
                  >
                    {act.whisper}
                  </p>
                </motion.div>

                {/* 主標 */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-serif-tc text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.4] font-medium mb-12 whitespace-pre-line ${act.accentClass}`}
                >
                  {act.title}
                </motion.h2>

                {/* 裝飾金線 */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-24 h-px bg-leaf-gold mb-12 origin-left"
                />

                {/* 內文 */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.75 }}
                  className="font-sans-tc text-[clamp(1rem,1.35vw,1.2rem)] leading-[2.1] whitespace-pre-line max-w-xl font-light text-ink/72"
                >
                  {act.body}
                </motion.p>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
