"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
//   BeforeAfterV3 — The Proof
//   左右拖曳分隔條 + 朱砂把手印章
//   下方 count-up 數據 (肌膚含水度 +47%)
//   用 SVG placeholder (避免真實醫美照片合規問題)
// ═══════════════════════════════════════════════════════════════

function useCountUp(target: number, duration = 1.6, trigger = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);
  return value;
}

export function BeforeAfterV3() {
  const ref = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [split, setSplit] = useState(50); // % from left
  const count = useCountUp(47, 1.8, inView);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.max(5, Math.min(95, pct)));
  };

  return (
    <section ref={ref} className="relative bg-ink paper-texture py-32 md:py-40 px-8 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif-tc text-vermillion-light/90 text-sm tracking-[0.55em] mb-4"
          >
            捌 · 見證
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-elegant italic text-paper-cream text-[clamp(2.5rem,6vw,4.5rem)] leading-tight"
          >
            The Proof
          </motion.h2>
        </div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          ref={sliderRef}
          className="relative aspect-[16/9] max-h-[520px] w-full overflow-hidden cursor-ew-resize select-none"
          style={{ borderRadius: "2px", boxShadow: "0 20px 60px -10px rgba(0,0,0,0.5)" }}
          onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onClick={(e) => handleMove(e.clientX)}
        >
          {/* BEFORE (full — warmer skin, mid-tone) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #C8977D 0%, #A87A61 50%, #8C624A 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, rgba(184,50,44,0.15), transparent 40%), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.2), transparent 45%)",
              }}
            />
            <p className="absolute top-6 left-6 font-elegant italic text-paper-cream/85 text-sm tracking-[0.4em] uppercase">
              before
            </p>
          </div>

          {/* AFTER (clipped to split %) */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - split}% 0 0)`,
              background:
                "linear-gradient(135deg, #F5E4DC 0%, #E8C4BA 50%, #D4A89B 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 40% 40%, rgba(230,207,160,0.35), transparent 45%)",
              }}
            />
            <p className="absolute top-6 right-6 font-elegant italic text-ink/60 text-sm tracking-[0.4em] uppercase">
              after · 28d
            </p>
          </div>

          {/* Split line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-leaf-gold pointer-events-none"
            style={{ left: `${split}%`, boxShadow: "0 0 12px rgba(201,164,107,0.7)" }}
          />

          {/* Drag handle — vermillion seal */}
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-vermillion flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-none"
            style={{
              left: `${split}%`,
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.64  0 0 0 0 0.17  0 0 0 0 0.18  0 0 0 0.42 0'/></filter><rect width='100%25' height='100%25' filter='url(%23s)'/></svg>")`,
              backgroundBlendMode: "overlay",
              borderRadius: "2px",
              boxShadow: "0 4px 14px rgba(184,50,44,0.5), inset 0 0 0 2px rgba(201,164,107,0.3)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 6L4 12L9 18M15 6L20 12L15 18" stroke="#F7F2E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-6 font-elegant italic text-paper-cream/40 text-xs tracking-[0.3em] uppercase"
        >
          ← drag to compare →
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <p className="font-elegant italic text-leaf-gold/75 text-[0.75rem] tracking-[0.45em] uppercase mb-4">
            28-Day Hydration Index
          </p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-elegant italic text-leaf-gold text-8xl md:text-9xl leading-none">
              +{count}
            </span>
            <span className="font-serif-tc text-leaf-gold text-5xl leading-none">%</span>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 1.6 }}
            className="w-32 h-px bg-leaf-gold mx-auto mt-8 origin-center"
          />
          <p className="font-serif-tc text-paper-cream/80 text-lg mt-6 tracking-wider">
            肌膚含水度 提升
          </p>
          <p className="font-elegant italic text-paper-cream/35 text-[0.7rem] tracking-widest mt-4 max-w-md mx-auto leading-relaxed">
            ※ 數據為個別案例,實際效果因人而異
          </p>
        </motion.div>
      </div>
    </section>
  );
}
