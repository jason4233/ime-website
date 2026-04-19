"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MirrorIllustration, CellMessengerIllustration, BloomIllustration } from "./brand-story/StoryIllustration";

// 改版：移除 GSAP ScrollTrigger + pin (它會偷改 DOM 導致 React insertBefore 崩潰)
// 改用 CSS position:sticky 達到相同「滾動時 hero 文字停留」效果
// activeAct 用 native scroll progress 驅動

const illustrations = [MirrorIllustration, CellMessengerIllustration, BloomIllustration];

const acts = [
  {
    id: 0,
    bg: "bg-deep-purple",
    textColor: "text-ivory",
    subColor: "text-ivory/40",
    lineColor: "bg-gold/30",
    title: "所有的「還可以」,\n都是對自己的一種將就。",
    body: `我們見過太多妳這樣的女人,在 25 歲以後開始練習一件事:妥協。
妥協那張被拍得不好看的照片,妥協鏡子裡越來越陌生的自己,
妥協「沒辦法,年紀到了」這六個字。`,
  },
  {
    id: 1,
    bg: "bg-cream-warm",
    textColor: "text-night",
    subColor: "text-night/50",
    lineColor: "bg-brand/40",
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
    subColor: "text-night/50",
    lineColor: "bg-gold/40",
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
      // progress: 0 -> 1 從 section 進入頂部到完全滑出
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
    // 外層給 3 screen 高度，製造滾動距離
    <div ref={outerRef} style={{ height: "300vh" }} className="relative">
      {/* 黏著在視窗內 — sticky 取代 GSAP pin */}
      <section className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 背景色過渡 */}
        {acts.map((a) => (
          <motion.div
            key={a.id}
            className={`absolute inset-0 ${a.bg} noise-overlay`}
            initial={false}
            animate={{ opacity: activeAct === a.id ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}

        {/* 裝飾線 */}
        <div className="absolute top-[10%] right-[12%] w-px h-[30vh] bg-gradient-to-b from-brand/10 to-transparent z-10" />
        <div className="absolute bottom-[15%] left-[10%] w-px h-[20vh] bg-gradient-to-t from-gold/10 to-transparent z-10" />

        {/* 進度指示器 */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {acts.map((a) => (
            <div
              key={a.id}
              className={`w-1.5 rounded-full transition-all duration-500 ${
                activeAct === a.id
                  ? `h-8 ${activeAct === 0 ? "bg-gold/60" : "bg-brand/60"}`
                  : `h-1.5 ${activeAct === 0 ? "bg-ivory/20" : "bg-night/15"}`
              }`}
            />
          ))}
        </div>

        {/* 內容 */}
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* 左：文字 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeAct}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-center lg:text-left order-2 lg:order-1"
              >
                <p className={`font-display text-sm tracking-[0.3em] mb-6 ${act.subColor}`}>
                  {String(activeAct + 1).padStart(2, "0")} / 03
                </p>

                <h2 className={`font-serif-tc text-[clamp(1.6rem,4vw,2.8rem)] leading-[1.3] font-semibold mb-6 whitespace-pre-line ${act.textColor}`}>
                  {act.title}
                </h2>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`w-12 h-px mx-auto lg:mx-0 mb-6 origin-left ${act.lineColor}`}
                />

                <p className={`font-sans-tc text-body-lg leading-[2] whitespace-pre-line max-w-xl mx-auto lg:mx-0 ${act.subColor}`}>
                  {act.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* 右：插畫 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`illu-${activeAct}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center order-1 lg:order-2
                           h-[280px] md:h-[360px] lg:h-[450px] max-w-md mx-auto"
              >
                {(() => {
                  const Component = illustrations[activeAct];
                  return <Component />;
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
