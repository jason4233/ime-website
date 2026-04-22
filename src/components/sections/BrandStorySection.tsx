"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//   Brand Story — 三幕故事
//   純文字 + 金線裝飾 + cream 暖色背景
//   奢華留白 × 溫暖療癒 — 無人物剪影，讓文字自己說話
// ═══════════════════════════════════════════════════════════════

type Act = {
  id: number;
  bg: string;
  textColor: string;
  subColor: string;
  lineColor: string;
  glowColor: string;
  whisper: string;
  title: string;
  body: string;
};

const acts: Act[] = [
  {
    id: 0,
    bg: "bg-cream-warm",
    textColor: "text-night",
    subColor: "text-night/60",
    lineColor: "bg-gold/50",
    glowColor: "rgba(184,149,63,0.35)",
    whisper: "when did I stop looking?",
    title: "所有的「還可以」,\n都是對自己的一種將就。",
    body: `妥協那張被拍得不好看的照片,
妥協鏡子裡越來越陌生的自己,
妥協「沒辦法,年紀到了」這六個字。`,
  },
  {
    id: 1,
    bg: "bg-cream-rose",
    textColor: "text-deep-purple",
    subColor: "text-deep-purple/70",
    lineColor: "bg-brand/45",
    glowColor: "rgba(123,47,190,0.32)",
    whisper: "a letter between cells",
    title: "直到妳知道,\n細胞之間有郵差。",
    body: `外泌體——細胞與細胞之間的訊息郵差。
它把「修護」這個訊息,送到該去的地方。
而臍帶間質幹細胞分泌的外泌體,是郵差裡最溫柔的那一種。`,
  },
  {
    id: 2,
    bg: "bg-cream-amber",
    textColor: "text-night",
    subColor: "text-night/60",
    lineColor: "bg-gold/60",
    glowColor: "rgba(212,185,106,0.4)",
    whisper: "a choice, to bloom again",
    title: "i me,\n是妳對自己的一次重新選擇。",
    body: `我們不想說服妳變美,
我們想讓妳想起——
妳本來就值得每天早上醒來,看鏡子時微微笑一下。`,
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
        {/* Layer 0 — 背景色 cross-fade */}
        {acts.map((a) => (
          <motion.div
            key={a.id}
            className={`absolute inset-0 ${a.bg} noise-overlay`}
            initial={false}
            animate={{ opacity: activeAct === a.id ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}

        {/* Layer 5 — 柔和氛圍光暈（取代走路女,給暖色背景一點呼吸感） */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <motion.div
            key={`glow-a-${activeAct}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.45, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[18%] left-[12%] w-[42vw] h-[42vw] rounded-full blur-[140px]"
            style={{
              background: `radial-gradient(circle, ${act.glowColor}, transparent 70%)`,
            }}
          />
          <motion.div
            key={`glow-b-${activeAct}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.28, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[12%] right-[10%] w-[32vw] h-[32vw] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(212,168,155,0.3), transparent 70%)",
            }}
          />
        </div>

        {/* Layer 8 — 金絲/紫絲裝飾線 */}
        <div className="absolute top-[10%] right-[10%] w-px h-[32vh] bg-gradient-to-b from-gold/30 to-transparent z-[8]" />
        <div className="absolute bottom-[14%] left-[10%] w-px h-[22vh] bg-gradient-to-t from-brand/25 to-transparent z-[8]" />

        {/* Layer 10 — 章節進度指示 */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {acts.map((a) => (
            <div
              key={a.id}
              className={`w-1.5 rounded-full transition-all duration-500 ${
                activeAct === a.id
                  ? "h-8 bg-brand/55"
                  : "h-1.5 bg-night/15"
              }`}
            />
          ))}
        </div>

        {/* Layer 20 — 文字主體 */}
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
                {/* 章節編號 */}
                <div className="flex items-center justify-center gap-4 mb-10">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-12 h-px origin-right ${act.lineColor}`}
                  />
                  <p className={`font-elegant italic text-[0.72rem] tracking-[0.35em] uppercase ${act.subColor}`}>
                    Act {String(activeAct + 1).padStart(2, "0")} / 03
                  </p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-12 h-px origin-left ${act.lineColor}`}
                  />
                </div>

                {/* 英文詩句 */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className={`font-elegant italic text-[clamp(1rem,1.4vw,1.25rem)] tracking-wide mb-10 ${act.subColor}`}
                >
                  &ldquo; {act.whisper} &rdquo;
                </motion.p>

                {/* 主標題 */}
                <h2
                  className={`font-serif-tc text-[clamp(2rem,5vw,3.6rem)] leading-[1.4] font-medium mb-10 whitespace-pre-line ${act.textColor}`}
                >
                  {act.title}
                </h2>

                {/* 裝飾金線 */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-20 h-px mx-auto mb-10 origin-center ${act.lineColor}`}
                />

                {/* 內文 */}
                <p
                  className={`font-sans-tc text-[clamp(1rem,1.3vw,1.15rem)] leading-[2] whitespace-pre-line max-w-xl mx-auto font-light ${act.subColor}`}
                >
                  {act.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
