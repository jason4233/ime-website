"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════════
//   CharacterReveal — 字元逐一入場
//   每字 0.05s stagger,y+opacity,使用 spring easing
//   適合 Hero 中文主標、Section 章節標題
// ═══════════════════════════════════════════════════════════════

interface CharacterRevealProps {
  text: string;
  className?: string;
  delayStart?: number;
  stagger?: number;
  duration?: number;
  animateOnMount?: boolean;
}

export function CharacterReveal({
  text,
  className = "",
  delayStart = 0,
  stagger = 0.055,
  duration = 0.7,
  animateOnMount = false,
}: CharacterRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const shouldAnimate = animateOnMount || inView;

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          animate={shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{
            duration,
            delay: delayStart + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          aria-hidden
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
