"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//   Pilgrim's Passage — 朝聖者漫遊層
//   雙水彩剪影在背景永恆行走，文字為主 focal
//   她不是插畫、不是卡片 — 是路過你讀故事時的夢
// ═══════════════════════════════════════════════════════════════

type Act = {
  id: number;
  bg: string;
  textColor: string;
  subColor: string;
  lineColor: string;
  whisper: string; // 頂部小字（英文詩句）
  title: string;
  body: string;
};

const acts: Act[] = [
  {
    id: 0,
    bg: "bg-deep-purple",
    textColor: "text-ivory",
    subColor: "text-ivory/45",
    lineColor: "bg-gold/40",
    whisper: "when did I stop looking?",
    title: "所有的「還可以」,\n都是對自己的一種將就。",
    body: `我們見過太多妳這樣的女人,在 25 歲以後開始練習一件事:妥協。
妥協那張被拍得不好看的照片,妥協鏡子裡越來越陌生的自己,
妥協「沒辦法,年紀到了」這六個字。`,
  },
  {
    id: 1,
    bg: "bg-cream-warm",
    textColor: "text-night",
    subColor: "text-night/55",
    lineColor: "bg-brand/50",
    whisper: "a letter between cells",
    title: "直到妳知道,\n細胞之間有郵差。",
    body: `外泌體——細胞與細胞之間的訊息郵差。
它把「修護」這個訊息,送到該去的地方。
而臍帶間質幹細胞分泌的外泌體,是郵差裡最溫柔的那一種。
台中榮總神經外科楊孟寅醫師的專利技術,把它從實驗室帶到妳的肌膚上。`,
  },
  {
    id: 2,
    bg: "bg-cream-rose",
    textColor: "text-night",
    subColor: "text-night/55",
    lineColor: "bg-gold/50",
    whisper: "a choice, to bloom again",
    title: "i me——不是保養品牌,\n是妳對自己的一次重新選擇。",
    body: `我們不想說服妳變美,我們想讓妳想起:
妳本來就值得每天早上醒來,看鏡子時微微笑一下。
這件事,不該等到更老的時候才後悔。`,
  },
];

export function BrandStorySection() {
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
    <div ref={outerRef} style={{ height: "300vh" }} className="relative">
      <section className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ─── Layer 0: 背景色 cross-fade ─── */}
        {acts.map((a) => (
          <motion.div
            key={a.id}
            className={`absolute inset-0 ${a.bg} noise-overlay`}
            initial={false}
            animate={{ opacity: activeAct === a.id ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}

        {/* ─── Layer 5: Pilgrim's Passage 漫遊剪影（背景永恆行走） ─── */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {/* Walker Purple — 前景、由右走向左、紫長裙 */}
          <motion.div
            className="absolute bottom-0 h-[72%] aspect-[627/940] will-change-transform"
            initial={{ x: "100vw" }}
            animate={{
              x: ["100vw", "-45vw"],
              y: [0, -3, 0, 3, 0, -3, 0, 3, 0],
              rotate: [-0.6, 0.6, -0.6, 0.6, -0.6],
            }}
            transition={{
              x: { duration: 48, repeat: Infinity, ease: "linear" },
              y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              opacity: activeAct === 0 ? 0.28 : 0.22,
              mixBlendMode: activeAct === 0 ? "screen" : "multiply",
              filter: "saturate(0.85)",
            }}
          >
            <Image
              src="/images/story/walker-purple.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-contain"
              quality={80}
              aria-hidden="true"
            />
          </motion.div>

          {/* Walker Gold — 後景、由左走向右、金斗篷、更淡更慢 */}
          <motion.div
            className="absolute bottom-[6%] h-[55%] aspect-[627/940] will-change-transform"
            initial={{ x: "-45vw" }}
            animate={{
              x: ["-45vw", "100vw"],
              y: [0, -2, 0, 2, 0, -2, 0, 2, 0],
              rotate: [0.5, -0.5, 0.5, -0.5, 0.5],
            }}
            transition={{
              x: { duration: 68, repeat: Infinity, ease: "linear", delay: 12 },
              y: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              opacity: activeAct === 0 ? 0.18 : 0.14,
              mixBlendMode: activeAct === 0 ? "screen" : "multiply",
              filter: "saturate(0.8) blur(0.3px)",
            }}
          >
            <Image
              src="/images/story/walker-gold.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 40vw, 22vw"
              className="object-contain"
              quality={80}
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* ─── Layer 8: 金線裝飾 ─── */}
        <div className="absolute top-[12%] right-[10%] w-px h-[28vh] bg-gradient-to-b from-brand/15 to-transparent z-[8]" />
        <div className="absolute bottom-[14%] left-[8%] w-px h-[18vh] bg-gradient-to-t from-gold/20 to-transparent z-[8]" />

        {/* ─── Layer 10: 進度指示器 ─── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {acts.map((a) => (
            <div
              key={a.id}
              className={`w-1.5 rounded-full transition-all duration-500 ${
                activeAct === a.id
                  ? `h-8 ${activeAct === 0 ? "bg-gold/70" : "bg-brand/70"}`
                  : `h-1.5 ${activeAct === 0 ? "bg-ivory/25" : "bg-night/20"}`
              }`}
            />
          ))}
        </div>

        {/* ─── Layer 20: 文字內容（主 focal，居中） ─── */}
        <div className="relative z-20 h-full flex items-center justify-center px-6">
          <div className="max-w-3xl w-full text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeAct}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* 章節編號 + 英文詩句（頂部氣氛） */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className={`w-8 h-px ${act.lineColor}`} />
                  <p className={`font-display text-[0.65rem] tracking-[0.4em] uppercase ${act.subColor}`}>
                    {String(activeAct + 1).padStart(2, "0")} / 03
                  </p>
                  <div className={`w-8 h-px ${act.lineColor}`} />
                </div>

                {/* 英文詩句 — 斜體 italic 襯托 */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className={`font-elegant italic text-[clamp(0.95rem,1.4vw,1.2rem)] tracking-wide mb-10 ${act.subColor}`}
                >
                  &ldquo; {act.whisper} &rdquo;
                </motion.p>

                {/* 主標題 */}
                <h2
                  className={`font-serif-tc text-[clamp(1.8rem,4.5vw,3.2rem)] leading-[1.35] font-semibold mb-8 whitespace-pre-line ${act.textColor}`}
                  style={{
                    textShadow:
                      activeAct === 0
                        ? "0 2px 20px rgba(0,0,0,0.4)"
                        : "0 1px 12px rgba(255,255,255,0.6)",
                  }}
                >
                  {act.title}
                </h2>

                {/* 裝飾金線 */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className={`w-16 h-px mx-auto mb-8 origin-center ${act.lineColor}`}
                />

                {/* 內文 */}
                <p
                  className={`font-sans-tc text-body-lg leading-[2] whitespace-pre-line max-w-2xl mx-auto ${act.subColor}`}
                  style={{
                    textShadow:
                      activeAct === 0
                        ? "0 1px 8px rgba(0,0,0,0.3)"
                        : "0 1px 6px rgba(255,255,255,0.5)",
                  }}
                >
                  {act.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Layer 9: 地平線光暈（讓剪影腳底有立足地） ─── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-[9] pointer-events-none"
          style={{
            background:
              activeAct === 0
                ? "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)"
                : "linear-gradient(to top, rgba(120,80,120,0.1) 0%, transparent 100%)",
          }}
        />
      </section>
    </div>
  );
}
