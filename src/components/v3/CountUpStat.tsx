"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════
//   CountUpStat — 數字 count-up 元件
//   進入視窗時,從 0 累加到 target。cubic ease-out, 1.8s default。
// ═══════════════════════════════════════════════════════════════

interface CountUpStatProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  decimals?: number;
  locale?: boolean;
}

export function CountUpStat({
  target,
  suffix = "",
  prefix = "",
  className = "",
  duration = 1.8,
  decimals = 0,
  locale = true,
}: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : locale
      ? Math.round(value).toLocaleString()
      : Math.round(value).toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
