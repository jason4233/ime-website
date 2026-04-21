"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// 改版：836 行 SVG 「假手繪小王子」已退役
// 現在用 FLUX 生成的真水彩插畫（Saint-Exupéry 風格 × 女性主角）
// 三張圖同時 keep 在 DOM 中，用 opacity 做 cross-fade，切換瞬間零閃爍
// Ken Burns（緩慢縮放平移）讓靜態圖也呼吸

type Act = {
  id: number;
  image: string;
  alt: string;
  bg: string;
  textColor: string;
  subColor: string;
  lineColor: string;
  title: string;
  body: string;
};

const acts: Act[] = [
  {
    id: 0,
    image: "/images/story/act1-mirror.jpg",
    alt: "水彩手繪插畫：東方女性獨自站在小星球上，望向前方的星空",
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
    image: "/images/story/act2-messenger.jpg",
    alt: "水彩手繪插畫：東方女性披著金色斗篷，伸手送出金色光點到遠方紫色星球",
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
    image: "/images/story/act3-bloom.jpg",
    alt: "水彩手繪插畫：東方女性張開雙手擁抱金色晨光，周圍紫色花朵盛開",
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
        {/* 背景色 cross-fade */}
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
            {/* 左：文字（保持原本 AnimatePresence 切換） */}
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

            {/* 右：水彩插畫 —— 三張圖全部 render，opacity 切換（瀏覽器快取 → 零閃爍） */}
            <div className="relative order-1 lg:order-2 mx-auto w-full max-w-md
                            h-[280px] md:h-[360px] lg:h-[450px]
                            rounded-[2rem] overflow-hidden
                            shadow-[0_30px_60px_-20px_rgba(70,30,120,0.35)]">
              {acts.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={false}
                  animate={{
                    opacity: activeAct === a.id ? 1 : 0,
                    scale: activeAct === a.id ? 1.0 : 1.04,
                  }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {/* Ken Burns 緩慢呼吸（只對 active 圖啟用，省資源） */}
                  <motion.div
                    className="relative w-full h-full"
                    animate={
                      activeAct === a.id
                        ? { scale: [1, 1.045, 1] }
                        : { scale: 1 }
                    }
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={a.image}
                      alt={a.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 448px"
                      priority={i === 0}
                      className="object-cover"
                      quality={85}
                    />
                  </motion.div>

                  {/* 紙質暖光 overlay — 讓圖跟各 act 的 bg 色融合 */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40"
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(180deg, rgba(155,93,212,0.12) 0%, transparent 50%, rgba(30,10,50,0.2) 100%)"
                          : i === 1
                          ? "linear-gradient(180deg, rgba(245,220,180,0.15) 0%, transparent 50%, rgba(180,130,80,0.15) 100%)"
                          : "linear-gradient(180deg, rgba(245,200,200,0.15) 0%, transparent 50%, rgba(180,100,120,0.15) 100%)",
                    }}
                  />

                  {/* 邊緣漸暗 vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.18) 100%)",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
