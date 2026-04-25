"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════
//   LuxeProof — Numerical proof with scroll-linked count up
// ═══════════════════════════════════════════════════════════════

const STATS = [
  { value: 47, suffix: "%", caption: "28-day Hydration Index", zh: "肌膚含水度 提升" },
  { value: 80, suffix: "%", caption: "Post-Laser Recovery", zh: "雷射術後修復加速" },
  { value: 2000, suffix: "億", caption: "Vesicles per mL", zh: "每 1mL 外泌體" },
];

function CountUp({
  target,
  inView,
  format = (n: number) => n.toLocaleString(),
}: {
  target: number;
  inView: boolean;
  format?: (n: number) => string;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, inView]);
  return <>{format(val)}</>;
}

export function LuxeProof() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id="proof"
      ref={ref}
      className="relative bg-luxe-bgElevated py-section overflow-hidden"
    >
      {/* Grain layer */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay pointer-events-none"
      >
        <filter id="proof-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 0.7  0 0 0 0.6 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#proof-grain)" />
      </svg>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <p className="font-italic italic text-luxe-gold/75 text-sm tracking-[0.45em] uppercase mb-4">
            V · The Proof
          </p>
          <h2 className="font-serif text-h1 text-luxe-ivory leading-[1.1] tracking-tight">
            數字，不需要解釋。
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 1,
                delay: 0.2 + i * 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center"
            >
              <div className="font-display italic text-luxe-gold leading-[0.85] tabular-nums">
                <span className="text-7xl md:text-8xl lg:text-9xl">
                  +<CountUp target={stat.value} inView={inView} />
                </span>
                <span className="font-display text-4xl md:text-5xl ml-1">
                  {stat.suffix}
                </span>
              </div>
              <div className="h-px w-12 bg-luxe-gold/50 mx-auto my-6" />
              <p className="font-italic italic text-luxe-ivoryFade text-[0.7rem] tracking-[0.4em] uppercase mb-2">
                {stat.caption}
              </p>
              <p className="font-serif text-luxe-ivoryDim text-base tracking-wide">
                {stat.zh}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-center font-italic italic text-luxe-ivoryFade text-[0.7rem] tracking-[0.3em] uppercase mt-20 max-w-md mx-auto leading-loose">
          ※ 數據為個別案例，實際效果因人而異
        </p>
      </div>
    </section>
  );
}
