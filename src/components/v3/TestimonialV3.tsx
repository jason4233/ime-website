"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
//   TestimonialV3 — Whispers
//   單幅全寬引言 + 朱砂超大引號 + 金色 pagination dots
//   每 7 秒自動輪播,也可手動
// ═══════════════════════════════════════════════════════════════

const testimonials = [
  {
    quote: "開始用 i me 之後,早上起床鏡子裡的自己,不用再逃。",
    name: "沈小姐",
    age: "44 歲",
    context: "使用 3 個月",
  },
  {
    quote: "以為年紀到了就是這樣,沒想到皮膚可以再次重新開始。",
    name: "陳女士",
    age: "52 歲",
    context: "使用 6 個月",
  },
  {
    quote: "不是變年輕,是變得更像自己——最舒服的那個版本。",
    name: "王小姐",
    age: "38 歲",
    context: "使用 4 個月",
  },
];

export function TestimonialV3() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % testimonials.length), 7200);
    return () => clearInterval(t);
  }, [inView, paused]);

  const t = testimonials[active];

  return (
    <section
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative bg-paper-cream paper-texture py-32 md:py-44 px-8 overflow-hidden"
    >
      {/* 背景金色暖光 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[100px] pointer-events-none opacity-25"
        style={{ background: "radial-gradient(circle, rgba(230,207,160,0.5), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif-tc text-vermillion/85 text-sm tracking-[0.55em] mb-12"
        >
          玖 · 耳語
        </motion.p>

        {/* Quote mark */}
        <motion.div
          initial={{ opacity: 0, scale: 1.4 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.3, 1.4, 0.5, 1] }}
          className="font-elegant italic text-vermillion leading-none select-none"
          style={{ fontSize: "clamp(6rem, 14vw, 12rem)" }}
        >
          &ldquo;
        </motion.div>

        {/* Quote + crossfade */}
        <div className="relative min-h-[260px] flex items-center justify-center -mt-8 md:-mt-12">
          <AnimatePresence mode="wait">
            <motion.article
              key={active}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <blockquote className="font-serif-tc text-ink text-[clamp(1.5rem,3.5vw,2.4rem)] leading-[1.7] font-normal mb-12">
                {t.quote}
              </blockquote>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-16 h-px bg-leaf-gold mx-auto mb-6 origin-center"
              />
              <p className="font-elegant italic text-leaf-goldDeep text-[0.7rem] tracking-[0.4em] uppercase mb-1.5">
                {t.context}
              </p>
              <p className="font-serif-tc text-ink text-lg font-medium">
                {t.name} <span className="text-ink/50 text-sm ml-2">· {t.age}</span>
              </p>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-3 mt-16">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`見證 ${i + 1}`}
              className="group relative h-2 w-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor: active === i ? "#B8322C" : "rgba(26, 21, 20, 0.2)",
                width: active === i ? 28 : 8,
              }}
            >
              {active === i && !paused && (
                <motion.div
                  key={active}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 7.2, ease: "linear" }}
                  className="absolute inset-0 bg-leaf-gold rounded-full origin-left"
                />
              )}
            </button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 font-elegant italic text-ink/35 text-[0.7rem] tracking-wider max-w-md mx-auto leading-relaxed"
        >
          ※ 以上為個人主觀感受分享,每個人膚質與生活習慣不同,效果因人而異。
        </motion.p>
      </div>
    </section>
  );
}
